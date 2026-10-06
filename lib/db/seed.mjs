import pg from 'pg';

const { Client } = pg;

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/dayar_db";

const client = new Client({
  connectionString: connectionString,
});

const apartments = [
  {
    apartmentNumber: '00010',
    title: 'شقة فاخرة مطلة على النيل',
    city: 'القاهرة',
    district: 'الزمالك',
    address: 'شارع أبو الفدا، الزمالك، القاهرة',
    description: 'شقة فاخرة بتشطيبات فندقية راقية وإطلالة بانورامية ساحرة على نهر النيل. تتميز بتصميم عصري وأثاث فاخر مع جميع الخدمات الفندقية.',
    rooms: 3,
    bathrooms: 3,
    area: 250,
    priceDay: 3000,
    priceWeek: 18000,
    priceMonth: 60000,
    status: 'available',
    images: ['/uploads/img1.png', '/uploads/img2.png']
  },
  {
    apartmentNumber: '00011',
    title: 'شقة عصرية في التجمع الخامس',
    city: 'القاهرة',
    district: 'التجمع الخامس',
    address: 'شارع التسعين الشمالي، التجمع الخامس',
    description: 'شقة عصرية مجهزة بأحدث التقنيات الذكية في قلب التجمع الخامس، بالقرب من أفضل المطاعم والمقاهي. مناسبة جداً للعائلات ورجال الأعمال.',
    rooms: 2,
    bathrooms: 2,
    area: 150,
    priceDay: 2000,
    priceWeek: 12000,
    priceMonth: 40000,
    status: 'available',
    images: ['/uploads/img3.png']
  },
  {
    apartmentNumber: '00012',
    title: 'بنتهاوس فاخر بفيو بحر',
    city: 'الإسكندرية',
    district: 'سان ستيفانو',
    address: 'كورنيش الإسكندرية، سان ستيفانو',
    description: 'بنتهاوس مذهل بإطلالة مباشرة على البحر الأبيض المتوسط في أرقى أحياء الإسكندرية. يتميز بتراس كبير ومسبح خاص وتجهيزات فندقية متكاملة.',
    rooms: 4,
    bathrooms: 4,
    area: 320,
    priceDay: 4500,
    priceWeek: 28000,
    priceMonth: 95000,
    status: 'available',
    images: ['/uploads/img2.png', '/uploads/img1.png']
  },
  {
    apartmentNumber: '00013',
    title: 'شقة سكنية هادئة بالشيخ زايد',
    city: 'الجيزة',
    district: 'الشيخ زايد',
    address: 'محور 26 يوليو، الشيخ زايد',
    description: 'وحدة سكنية هادئة في كمبوند راقي بالشيخ زايد. توفر الخصوصية التامة والمساحات الخضراء الواسعة مع أمن على مدار الساعة.',
    rooms: 3,
    bathrooms: 2,
    area: 180,
    priceDay: 1800,
    priceWeek: 11000,
    priceMonth: 38000,
    status: 'available',
    images: ['/uploads/img1.png']
  },
  {
    apartmentNumber: '00014',
    title: 'فيلا مصغرة بالساحل الشمالي',
    city: 'الإسكندرية',
    district: 'الساحل الشمالي',
    address: 'مارينا، الساحل الشمالي',
    description: 'فيلا مصغرة بخدمات فندقية قريبة من شاطئ البحر. مكان مثالي لقضاء العطلات الصيفية مع العائلة والتمتع بالرفاهية.',
    rooms: 3,
    bathrooms: 3,
    area: 210,
    priceDay: 5000,
    priceWeek: 30000,
    priceMonth: 100000,
    status: 'available',
    images: ['/uploads/img3.png', '/uploads/img2.png']
  },
  {
    apartmentNumber: '00015',
    title: 'ستوديو فندقي بالقرب من الأهرامات',
    city: 'الجيزة',
    district: 'الهرم',
    address: 'شارع الهرم الرئيسي، الجيزة',
    description: 'ستوديو فندقي أنيق بإطلالة مميزة على أهرامات الجيزة. مناسب للسياح والزوار لفترات قصيرة.',
    rooms: 1,
    bathrooms: 1,
    area: 80,
    priceDay: 1200,
    priceWeek: 7500,
    priceMonth: 25000,
    status: 'available',
    images: ['/uploads/img1.png']
  },
  {
    apartmentNumber: '00016',
    title: 'شقة عائلية راقية بالمهندسين',
    city: 'الجيزة',
    district: 'المهندسين',
    address: 'شارع جامعة الدول العربية، المهندسين',
    description: 'شقة عائلية راقية في قلب المهندسين. محاطة بالخدمات والمناطق التجارية والترفيهية.',
    rooms: 3,
    bathrooms: 2,
    area: 190,
    priceDay: 2200,
    priceWeek: 13000,
    priceMonth: 45000,
    status: 'available',
    images: ['/uploads/img2.png']
  },
  {
    apartmentNumber: '00017',
    title: 'وحدة سكنية فاخرة بالمعادي',
    city: 'القاهرة',
    district: 'المعادي',
    address: 'كورنيش النيل، المعادي',
    description: 'وحدة سكنية فاخرة في المعادي توفر أجواء هادئة ومريحة بعيداً عن صخب المدينة، مع إطلالة جميلة على النيل.',
    rooms: 2,
    bathrooms: 2,
    area: 160,
    priceDay: 2500,
    priceWeek: 15000,
    priceMonth: 50000,
    status: 'available',
    images: ['/uploads/img3.png']
  },
  {
    apartmentNumber: '00018',
    title: 'شاليه مميز بالعين السخنة',
    city: 'السويس',
    district: 'العين السخنة',
    address: 'طريق الزعفرانة، العين السخنة',
    description: 'شاليه مميز بإطلالة ساحرة على البحر الأحمر. مكان رائع للاسترخاء والتمتع بالأنشطة البحرية طوال العام.',
    rooms: 2,
    bathrooms: 1,
    area: 120,
    priceDay: 3500,
    priceWeek: 22000,
    priceMonth: 80000,
    status: 'available',
    images: ['/uploads/img1.png']
  },
  {
    apartmentNumber: '00019',
    title: 'شقة اقتصادية فندقية بمدينة نصر',
    city: 'القاهرة',
    district: 'مدينة نصر',
    address: 'شارع مكرم عبيد، مدينة نصر',
    description: 'شقة عملية ومريحة بخدمات فندقية في موقع متميز بمدينة نصر. قريبة من مراكز التسوق والمواصلات العامة.',
    rooms: 2,
    bathrooms: 1,
    area: 110,
    priceDay: 1500,
    priceWeek: 9000,
    priceMonth: 30000,
    status: 'available',
    images: ['/uploads/img2.png']
  }
];

async function seed() {
  try {
    await client.connect();
    console.log('Connected to DB');

    // مسح الشقق السابقة لتجنب التكرار
    await client.query('DELETE FROM apartments;');
    console.log('Cleared existing apartments');

    for (const apt of apartments) {
      const query = `
        INSERT INTO apartments (
          apartment_number, title, city, district, address, description, 
          rooms, bathrooms, area, price_day, price_week, price_month, 
          status, images
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (apartment_number) DO UPDATE SET 
          title = EXCLUDED.title,
          city = EXCLUDED.city,
          district = EXCLUDED.district,
          address = EXCLUDED.address,
          description = EXCLUDED.description,
          price_day = EXCLUDED.price_day,
          images = EXCLUDED.images;
      `;
      
      const values = [
        apt.apartmentNumber, apt.title, apt.city, apt.district, apt.address, 
        apt.description, apt.rooms, apt.bathrooms, apt.area, apt.priceDay, 
        apt.priceWeek, apt.priceMonth, apt.status, apt.images
      ];

      await client.query(query, values);
      console.log('Inserted ' + apt.title);
    }

    console.log('Successfully seeded 10 Egyptian apartments with new images!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
  }
}

seed();
