import { DataSource } from 'typeorm';
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

const seed = async () => {
    const ds = new DataSource({
        type: 'postgres',
        url: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        entities: [User, City, Neighborhood, Listing, ListingImage, PropertyType, Favorite, Report, Notification, AdminAction, Inquiry],
    });

    await ds.initialize();
    console.log('Connected!');

    // Get admin user
    const userRepo = ds.getRepository(User);
    const admin = await userRepo.findOne({ where: { email: 'admin@aqar-morocco.ma' } });
    if (!admin) { console.error('No admin user!'); process.exit(1); }

    // Seed Cities
    const cityRepo = ds.getRepository(City);
    const existingCities = await cityRepo.find();
    let cities: City[];

    if (existingCities.length === 0) {
        const cityData = [
            { name: 'Casablanca', name_ar: 'الدار البيضاء', region: 'Casablanca-Settat' },
            { name: 'Marrakech', name_ar: 'مراكش', region: 'Marrakech-Safi' },
            { name: 'Rabat', name_ar: 'الرباط', region: 'Rabat-Salé-Kénitra' },
            { name: 'Tanger', name_ar: 'طنجة', region: 'Tanger-Tétouan-Al Hoceïma' },
            { name: 'Fès', name_ar: 'فاس', region: 'Fès-Mekès' },
            { name: 'Agadir', name_ar: 'أكادير', region: 'Souss-Massa' },
        ];
        cities = await cityRepo.save(cityData.map(c => cityRepo.create(c)));
    } else {
        cities = existingCities;
    }

    // Seed Property Types
    const ptRepo = ds.getRepository(PropertyType);
    const existingPT = await ptRepo.find();
    let propertyTypes: PropertyType[];

    if (existingPT.length === 0) {
        const ptData = [
            { name: 'Appartement', name_ar: 'شقة', icon: 'building' },
            { name: 'Villa', name_ar: 'فيلا', icon: 'home' },
            { name: 'Riad', name_ar: 'رياض', icon: 'landmark' },
            { name: 'Studio', name_ar: 'ستوديو', icon: 'door-open' },
            { name: 'Terrain', name_ar: 'أرض', icon: 'map' },
            { name: 'Bureau', name_ar: 'مكتب', icon: 'briefcase' },
        ];
        propertyTypes = await ptRepo.save(ptData.map(p => ptRepo.create(p)));
    } else {
        propertyTypes = existingPT;
    }

    // Seed Listings
    const listingRepo = ds.getRepository(Listing);
    const imageRepo = ds.getRepository(ListingImage);

    // Clean up
    await imageRepo.query('TRUNCATE TABLE listing_images CASCADE');
    await listingRepo.query('TRUNCATE TABLE listings CASCADE');

    const listings = [
        {
            title: 'Appartement de luxe - Gauthier, Casablanca',
            description: 'Superbe appartement de 140m² situé au cœur du quartier Gauthier. 3 chambres spacieuses, double salon moderne, finitions de haut standing. Proche de toutes commodités.',
            price: 2100000, listing_type: 'sale' as any, city_id: cities[0].id,
            property_type_id: propertyTypes[0].id, user_id: admin.id,
            area_m2: 140, bedrooms: 3, bathrooms: 2, floor: 4,
            phone_contact: '+212600000000', status: 'approved' as any,
            address: 'Quartier Gauthier, Casablanca',
            images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
        },
        {
            title: 'Villa Moderne avec piscine - Marrakech',
            description: 'Magnifique villa contemporaine de 400m² sur la route de l\'Ourika. 4 suites parentales, jardin arboré, piscine privée. Design épuré et confort absolu.',
            price: 5500000, listing_type: 'sale' as any, city_id: cities[1].id,
            property_type_id: propertyTypes[1].id, user_id: admin.id,
            area_m2: 400, bedrooms: 4, bathrooms: 4, floor: 0,
            phone_contact: '+212600000000', status: 'approved' as any,
            address: 'Route de l\'Ourika, Marrakech',
            images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
        },
        {
            title: 'Bel appartement à louer - Agdal, Rabat',
            description: 'Appartement meublé de 90m² au quartier Agdal. Lumineux, bien exposé, 2 chambres, salon confortable. Idéal pour expatriés ou cadres.',
            price: 8500, listing_type: 'rent' as any, city_id: cities[2].id,
            property_type_id: propertyTypes[0].id, user_id: admin.id,
            area_m2: 90, bedrooms: 2, bathrooms: 1, floor: 2,
            phone_contact: '+212600000000', status: 'approved' as any,
            address: 'Quartier Agdal, Rabat',
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
        },
        {
            title: 'Riad Authentique - Médina de Tanger',
            description: 'Riad restauré avec goût offrant une vue imprenable sur le détroit. 5 chambres, patio traditionnel, terrasse panoramique. Charme et authenticité.',
            price: 3200000, listing_type: 'sale' as any, city_id: cities[3].id,
            property_type_id: propertyTypes[2].id, user_id: admin.id,
            area_m2: 250, bedrooms: 5, bathrooms: 3, floor: 0,
            phone_contact: '+212600000000', status: 'approved' as any,
            address: 'Kashbah, Tanger',
            images: ['https://images.unsplash.com/photo-1590490360182-c33d955bc0ed?w=800'],
        },
        {
            title: 'Studio moderne - Hivernage, Marrakech',
            description: 'Studio neuf de 50m² dans une résidence sécurisée avec salle de sport et piscine. Emplacement premium, finitions de qualité.',
            price: 1200000, listing_type: 'sale' as any, city_id: cities[1].id,
            property_type_id: propertyTypes[3].id, user_id: admin.id,
            area_m2: 50, bedrooms: 1, bathrooms: 1, floor: 1,
            phone_contact: '+212600000000', status: 'approved' as any,
            address: 'L\'Hivernage, Marrakech',
            images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'],
        },
        {
            title: 'Appartement vue mer - Malabata, Tanger',
            description: 'Exceptionnel appartement de 110m² en front de mer. Salon avec balcon offrant une vue dégagée, résidence de prestige.',
            price: 2400000, listing_type: 'sale' as any, city_id: cities[3].id,
            property_type_id: propertyTypes[0].id, user_id: admin.id,
            area_m2: 110, bedrooms: 2, bathrooms: 2, floor: 6,
            phone_contact: '+212600000000', status: 'approved' as any,
            address: 'Malabata, Tanger',
            images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
        }
    ];

    for (const l of listings) {
        const images = l.images;
        const listingData = { ...l };
        delete (listingData as any).images;

        const entity = listingRepo.create(listingData as any);
        const savedListing = await listingRepo.save(entity) as any;

        for (let i = 0; i < images.length; i++) {
            await imageRepo.save(imageRepo.create({
                listing_id: savedListing.id,
                image_url: images[i],
                is_primary: i === 0,
                sort_order: i
            }));
        }
    }

    console.log('✅ Seeding complete!');
    process.exit(0);
};

seed().catch(err => {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
});
