import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

import { User } from './src/modules/users/entities/user.entity';
import { City } from './src/modules/cities/entities/city.entity';
import { Neighborhood } from './src/modules/cities/entities/neighborhood.entity';
import { Listing } from './src/modules/listings/entities/listing.entity';
import { ListingImage } from './src/modules/listings/entities/listing-image.entity';
import { PropertyType } from './src/modules/listings/entities/property-type.entity';
import { Favorite } from './src/modules/favorites/entities/favorite.entity';
import { Report } from './src/modules/reports/entities/report.entity';
import { Notification } from './src/modules/notifications/entities/notification.entity';
import { AdminAction } from './src/modules/admin/entities/admin-action.entity';
import { Inquiry } from './src/modules/inquiries/entities/inquiry.entity';

const DATABASE_URL = 'postgresql://postgres.tczbgwdgrazbtoqevedx:AqarMorocco2026!@aws-1-eu-west-2.pooler.supabase.com:5432/postgres';

const seedData = async () => {
    const dataSource = new DataSource({
        type: 'postgres',
        url: DATABASE_URL,
        synchronize: true,
        ssl: { rejectUnauthorized: false },
        entities: [
            User, City, Neighborhood, Listing, ListingImage,
            PropertyType, Favorite, Report, Notification,
            AdminAction, Inquiry,
        ],
    });

    try {
        console.log('Connecting to database and synchronizing schema...');
        await dataSource.initialize();
        console.log('Database connected and schema synchronized successfully!');

        console.log('Creating default admin user...');
        const userRepo = dataSource.getRepository(User);
        const existingAdmin = await userRepo.findOne({ where: { email: 'admin@aqar-morocco.ma' } });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('Admin123!', 10);
            const admin = userRepo.create({
                email: 'admin@aqar-morocco.ma',
                password_hash: hashedPassword,
                full_name: 'Admin Aqar',
                phone: '+212600000000',
                role: 'admin' as any,
            });
            await userRepo.save(admin);
            console.log('✅ Admin user created successfully! (admin@aqar-morocco.ma / Admin123!)');
        } else {
            console.log('ℹ️ Admin user already exists. Skipping creation.');
        }

        console.log('Running seed_data.sql...');
        const seedSqlPath = path.join(__dirname, 'database', 'seed_data.sql');
        if (fs.existsSync(seedSqlPath)) {
            const sql = fs.readFileSync(seedSqlPath, 'utf8');
            await dataSource.query(sql);
            console.log('✅ Seed data SQL executed successfully!');
        } else {
            console.log('⚠️ Warning: database/seed_data.sql not found.');
        }

        console.log('✨ Database setup complete.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during setup:', error);
        process.exit(1);
    }
};

seedData();
