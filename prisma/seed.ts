import 'dotenv/config';
import { randomUUID } from 'crypto';
import { prisma } from '../src/db';

const GHANA_REGIONS = [
  'Greater Accra', 'Ashanti Region', 'Eastern Region', 'Central Region',
  'Western Region', 'Volta Region', 'Northern Region', 'Upper East Region',
  'Upper West Region', 'Bono Region', 'Bono East Region', 'Ahafo Region',
  'Savannah Region', 'North East Region', 'Oti Region', 'Western North Region'
];

async function main() {
  console.log('Clearing old fake data (only users with @fake.evolucent.gh)...');
  await prisma.contribution.deleteMany({
    where: { user: { email: { endsWith: '@fake.evolucent.gh' } } }
  });
  await prisma.user.deleteMany({
    where: { email: { endsWith: '@fake.evolucent.gh' } }
  });

  // Make sure we have some projects to contribute to
  let projects = await prisma.project.findMany();
  
  if (projects.length === 0) {
    console.log('No projects found. Creating a few dummy projects...');
    await prisma.project.createMany({
      data: [
        {
          title: 'Accra flood drain clearance',
          description: 'Clearing the main drains in Accra to prevent seasonal flooding.',
          region: 'Greater Accra',
          goalAmount: 15000,
          currentAmount: 0,
        },
        {
          title: 'Kumasi Central Market solar lighting',
          description: 'Installing solar lights to improve safety and night trading.',
          region: 'Ashanti Region',
          goalAmount: 50000,
          currentAmount: 0,
        },
        {
          title: 'Sunyani market waste segregation hub',
          description: 'Building a modern waste sorting facility.',
          region: 'Bono Region',
          goalAmount: 35000,
          currentAmount: 0,
        }
      ]
    });
    projects = await prisma.project.findMany();
  }

  const GHANAIAN_NAMES = [
    'Kwame Mensah', 'Abena Osei', 'Kojo Appiah', 'Yaa Asantewaa',
    'Kofi Boakye', 'Afia Serwaa', 'Yaw Owusu', 'Akosua Addo',
    'Kwabena Ofori', 'Amma Frimpong', 'Kwaku Boateng', 'Yaa Ansah',
    'Kwasi Danquah', 'Akua Kusi', 'Kweku Baah'
  ];

  console.log('Creating 15 fake users with Ghanaian names...');
  const users = [];
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        name: GHANAIAN_NAMES[i],
        email: `citizen${i + 1}@fake.evolucent.gh`,
        region: GHANA_REGIONS[Math.floor(Math.random() * GHANA_REGIONS.length)],
      }
    });
    users.push(user);
  }

  console.log('Creating fake contributions...');
  let totalContributions = 0;

  for (const user of users) {
    // Each user makes 1 to 5 contributions
    const numContributions = Math.floor(Math.random() * 5) + 1;
    for (let j = 0; j < numContributions; j++) {
      const project = projects[Math.floor(Math.random() * projects.length)];
      const amount = Math.floor(Math.random() * 500) + 50; // Between 50 and 550 GHS
      
      await prisma.contribution.create({
        data: {
          amount,
          paymentRef: `fake_ref_${randomUUID()}`,
          status: 'SUCCESS',
          projectId: project.id,
          userId: user.id,
        }
      });

      // Update project currentAmount
      await prisma.project.update({
        where: { id: project.id },
        data: { currentAmount: { increment: amount } }
      });
      totalContributions++;
    }
  }

  console.log(`Successfully created ${users.length} users and ${totalContributions} successful contributions!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
