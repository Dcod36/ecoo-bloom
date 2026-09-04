/**
 * createSuperAdmin.js
 * ─────────────────────────────────────────────────────────────
 * ONE-TIME script to create the single super admin account.
 *
 * Run from the /server directory:
 *   node createSuperAdmin.js
 *
 * Or with custom credentials via env vars:
 *   ADMIN_EMAIL=boss@ecobloom.com ADMIN_PASSWORD=MySecret123 ADMIN_NAME="EcoBloom Admin" node createSuperAdmin.js
 *
 * ⚠️  Run this ONCE. Delete or secure this file after use.
 * ─────────────────────────────────────────────────────────────
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

// ── Config ────────────────────────────────────────────────────
const ADMIN_NAME     = process.env.ADMIN_NAME     || 'Super Admin';
const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || 'admin@ecobloom.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';   // change this!
// ─────────────────────────────────────────────────────────────

const User = require('./models/User');

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if an admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log(`\n⚠️  An admin already exists: ${existingAdmin.email}`);
            console.log('   Only one super admin is allowed. Exiting.\n');
            process.exit(0);
        }

        // Check if email is already taken by a user
        const emailTaken = await User.findOne({ email: ADMIN_EMAIL });
        if (emailTaken) {
            console.log(`\n❌ Email "${ADMIN_EMAIL}" is already registered as a regular user.`);
            console.log('   Use a different email for the admin account.\n');
            process.exit(1);
        }

        // Create the super admin — password is hashed by the User model's pre-save hook
        const admin = await User.create({
            name:             ADMIN_NAME,
            email:            ADMIN_EMAIL,
            password:         ADMIN_PASSWORD,
            role:             'admin',           // only place where role:'admin' is ever created
            profileCompleted: true,              // admin doesn't need profile completion
        });

        console.log('\n🎉 Super Admin created successfully!');
        console.log('─────────────────────────────────');
        console.log(`   Name:  ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Role:  ${admin.role}`);
        console.log('─────────────────────────────────');
        console.log('\n🔐 Login at: http://localhost:3000/login');
        console.log('⚠️  Delete this script or remove ADMIN_PASSWORD from env after use.\n');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error creating super admin:', error.message);
        process.exit(1);
    }
};

createSuperAdmin();
