const WasteLocation = require('../models/WasteLocation');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper: Calculate distance between two points in km (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

// Add a new waste location
const addWaste = async (req, res) => {
    try {
        const { wasteType, quantity, latitude, longitude, address } = req.body;

        const wasteLocation = await WasteLocation.create({
            wasteType,
            quantity,
            latitude,
            longitude,
            address,
            createdBy: req.user._id
        });

        res.status(201).json(wasteLocation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all waste locations
const getAllWaste = async (req, res) => {
    try {
        const wasteLocations = await WasteLocation.find().populate('createdBy', 'name');
        res.json(wasteLocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Gemini-powered analysis
const getWasteAnalysis = async (req, res) => {
    try {
        const wasteLocations = await WasteLocation.find();

        if (wasteLocations.length === 0) {
            return res.json({
                analysis: 'No waste data available yet. Add some waste markers to get area analysis.'
            });
        }

        // Group waste by approximate areas (using rounded coordinates)
        const areaData = {};
        wasteLocations.forEach(loc => {
            const areaKey = `${loc.address.split(',').slice(-2).join(',').trim()}`;
            if (!areaData[areaKey]) {
                areaData[areaKey] = { count: 0, types: {} };
            }
            areaData[areaKey].count++;
            areaData[areaKey].types[loc.wasteType] = (areaData[areaKey].types[loc.wasteType] || 0) + 1;
        });

        const prompt = `You are an environmental analyst. Based on the following waste accumulation data, provide a brief analysis (3-4 sentences) identifying which areas have the most garbage and what types are most common. Be concise and actionable.

Waste Data:
${Object.entries(areaData).map(([area, data]) =>
            `- ${area}: ${data.count} waste points (${Object.entries(data.types).map(([t, c]) => `${t}: ${c}`).join(', ')})`
        ).join('\n')}

Provide your analysis:`;

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            // Fallback analysis without Gemini
            const sortedAreas = Object.entries(areaData).sort((a, b) => b[1].count - a[1].count);
            const topArea = sortedAreas[0];
            return res.json({
                analysis: `Based on ${wasteLocations.length} recorded locations, the area with highest waste concentration is ${topArea[0]} with ${topArea[1].count} recorded points. Consider prioritizing cleanup efforts in this region.`
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysis = response.text();

        res.json({ analysis });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ message: 'Error generating analysis', error: error.message });
    }
};

// Chatbot: Answer location-based waste questions
const chatQuestionAnalysis = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({ message: 'Please provide a question' });
        }

        const lowerQuestion = question.toLowerCase();

        // Check if user wants full/complete analysis
        const isFullAnalysis = lowerQuestion.includes('full') ||
            lowerQuestion.includes('complete') ||
            lowerQuestion.includes('all') ||
            lowerQuestion.includes('total') ||
            lowerQuestion.includes('overall') ||
            lowerQuestion.includes('entire');

        if (isFullAnalysis) {
            // Provide full garbage analysis
            const allWaste = await WasteLocation.find();

            if (allWaste.length === 0) {
                return res.json({
                    response: "📊 **Full Analysis Report**\n\nNo waste data has been recorded in the system yet. Once you or other users add waste markers, I'll be able to provide a comprehensive analysis!"
                });
            }

            // Analyze all waste data
            const typeCount = {};
            const quantityCount = { small: 0, medium: 0, large: 0, very_large: 0 };
            const locationCounts = {};

            allWaste.forEach(w => {
                typeCount[w.wasteType] = (typeCount[w.wasteType] || 0) + 1;
                if (w.quantity) quantityCount[w.quantity]++;
                const area = w.address?.split(',')[0] || 'Unknown';
                locationCounts[area] = (locationCounts[area] || 0) + 1;
            });

            const topTypes = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);
            const topLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

            // Use Gemini if available
            const apiKey = process.env.GEMINI_API_KEY;

            const wasteData = `
Full System Analysis:
Total waste markers: ${allWaste.length}
Types: ${topTypes.map(([t, c]) => `${t}: ${c}`).join(', ')}
Quantities: Small: ${quantityCount.small}, Medium: ${quantityCount.medium}, Large: ${quantityCount.large}, Very Large: ${quantityCount.very_large}
Top 5 affected areas: ${topLocations.map(([l, c]) => `${l}: ${c} markers`).join(', ')}
`;

            if (apiKey) {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

                const prompt = `You are a friendly environmental analyst chatbot. Provide a comprehensive analysis based on this waste data:

${wasteData}

Give a detailed but friendly response covering:
1. Overall waste situation
2. Most problematic waste types
3. Hotspot areas that need attention
4. Recommended actions

Format nicely with emojis and clear sections. Keep it under 300 words.`;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                return res.json({ response: response.text() });
            }

            // Fallback without Gemini
            return res.json({
                response: `📊 **Full Garbage Analysis Report**\n\n📈 **Overview:** ${allWaste.length} total waste markers recorded.\n\n🗑️ **Waste Types:**\n${topTypes.map(([t, c]) => `• ${t}: ${c} markers`).join('\n')}\n\n📦 **Quantities:**\n• Small: ${quantityCount.small}\n• Medium: ${quantityCount.medium}\n• Large: ${quantityCount.large}\n• Very Large: ${quantityCount.very_large}\n\n📍 **Top Affected Areas:**\n${topLocations.map(([l, c]) => `• ${l}: ${c} markers`).join('\n')}\n\n💡 **Recommendation:** Focus cleanup efforts on ${topTypes[0]?.[0] || 'various'} waste in ${topLocations[0]?.[0] || 'affected areas'}.`
            });
        }

        // Extract location from question by removing common words
        const stopWords = ['garbage', 'waste', 'analysis', 'in', 'for', 'at', 'the', 'show', 'me', 'data', 'pollution', 'trash', 'rubbish', 'what', 'is', 'about', 'tell', 'how', 'much', 'area', 'near', 'around'];
        const words = question.toLowerCase().split(/\s+/);
        const locationWords = words.filter(word => !stopWords.includes(word) && word.length > 2);
        const locationQuery = locationWords.join(' ').trim() || question;

        // Geocode the extracted location
        const geocodeResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&limit=1`
        );
        const geocodeData = await geocodeResponse.json();

        let centerLat, centerLng, locationName;

        if (geocodeData.length > 0) {
            centerLat = parseFloat(geocodeData[0].lat);
            centerLng = parseFloat(geocodeData[0].lon);
            locationName = geocodeData[0].display_name.split(',')[0];
        } else {
            // If no location found, provide general analysis
            const allWaste = await WasteLocation.find();
            if (allWaste.length === 0) {
                return res.json({
                    response: "I couldn't find any waste data in the system yet. Please ask an admin to add some waste markers first."
                });
            }

            return res.json({
                response: `I couldn't identify a specific location in your question. Currently, there are ${allWaste.length} waste markers in our system. Try asking for \"full garbage analysis\" to see all data, or ask about a specific area like \"garbage in Angamaly\".`
            });
        }

        // Find all waste within 2km radius
        const allWaste = await WasteLocation.find();
        const nearbyWaste = allWaste.filter(loc => {
            const distance = calculateDistance(centerLat, centerLng, loc.latitude, loc.longitude);
            return distance <= 2; // 2km radius
        });

        if (nearbyWaste.length === 0) {
            return res.json({
                response: `No waste data found within 2km of ${locationName}. This area appears to be clean based on our current data, or no surveys have been conducted here yet.`
            });
        }

        // Analyze the nearby waste
        const typeCount = {};
        const quantityCount = { small: 0, medium: 0, large: 0, very_large: 0 };

        nearbyWaste.forEach(w => {
            typeCount[w.wasteType] = (typeCount[w.wasteType] || 0) + 1;
            if (w.quantity) quantityCount[w.quantity]++;
        });

        const mostCommonType = Object.entries(typeCount).sort((a, b) => b[1] - a[1])[0];

        // Build response using Gemini if available
        const apiKey = process.env.GEMINI_API_KEY;

        const wasteData = `
Location: ${locationName} (2km radius)
Total waste points: ${nearbyWaste.length}
Types breakdown: ${Object.entries(typeCount).map(([t, c]) => `${t}: ${c}`).join(', ')}
Quantity breakdown: Small: ${quantityCount.small}, Medium: ${quantityCount.medium}, Large: ${quantityCount.large}, Very Large: ${quantityCount.very_large}
`;

        if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const prompt = `You are a friendly environmental assistant chatbot. A user asked: "${question}"

Based on the following waste data for the area, provide a helpful, conversational response (3-5 sentences):

${wasteData}

Mention the total count, most common waste type, and give a brief recommendation. Be friendly and helpful.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;

            return res.json({ response: response.text() });
        }

        // Fallback response without Gemini
        return res.json({
            response: `📍 **${locationName}** (2km radius analysis)\n\nI found ${nearbyWaste.length} waste markers in this area. The most common type is **${mostCommonType[0]}** with ${mostCommonType[1]} occurrences. Quantity-wise: ${quantityCount.small} small, ${quantityCount.medium} medium, ${quantityCount.large} large, and ${quantityCount.very_large} very large waste deposits.\n\nConsider organizing a cleanup drive focusing on ${mostCommonType[0]} waste in this area!`
        });

    } catch (error) {
        console.error('Chat analysis error:', error);
        res.status(500).json({ message: 'Error processing question', error: error.message });
    }
};

module.exports = { addWaste, getAllWaste, getWasteAnalysis, chatQuestionAnalysis };

