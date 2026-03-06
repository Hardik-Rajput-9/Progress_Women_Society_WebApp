import { PrismaClient, ProgramCategory, ProgramStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data to prevent duplicates during development
  await prisma.donation.deleteMany();
  await prisma.program.deleteMany();

  console.log("🧹 Cleaned existing records.");

  // 1. Digital & English Skill Training
  const program1 = await prisma.program.create({
    data: {
      name: "Nari Shakti: Digital Lab & English Proficiency",
      description:
        "Bridging the digital and linguistic divide for women in urban villages. This intensive 3-month program equips participants with essential computer operations, internet safety protocols, and foundational spoken English. By partnering with local MSMEs, we ensure that upon graduation, these women are immediately employable for entry-level corporate and administrative roles.",
      category: ProgramCategory.SKILL_TRAINING,
      status: ProgramStatus.ACTIVE,
      startDate: new Date("2023-09-01T00:00:00Z"),
      targetBeneficiaries: 150,
      actualBeneficiaries: 85,
      location: "East Delhi Community Center",
      budget: 250000.0,
      imageUrl:
        "https://images.unsplash.com/photo-1531206715517-5c0ba140bef2?auto=format&fit=crop&q=80&w=1000", // High-quality placeholder
    },
  });

  // 2. Mahila Panchayat & Legal Aid (UPDATED TO PAST)
  const program2 = await prisma.program.create({
    data: {
      name: "Mahila Panchayat: Legal Aid & Rights Advocacy",
      description:
        "Operated in direct collaboration with the Delhi Women Commission, this grassroots initiative provided critical, free legal counseling and dispute resolution. We empowered women to navigate complex domestic violence cases, understand property rights, and secure essential government documentation.",
      category: ProgramCategory.LEGAL_AID,
      status: ProgramStatus.COMPLETED,
      startDate: new Date("2018-01-15T00:00:00Z"),
      endDate: new Date("2023-12-31T00:00:00Z"),
      targetBeneficiaries: 2500,
      actualBeneficiaries: 2842,
      location: "Delhi NCR Jurisdiction",
      budget: 180000.0,
      imageUrl:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1000",
    },
  });

  // 3. Micro-Enterprise & Craftsmanship
  const program3 = await prisma.program.create({
    data: {
      name: "Srijan: Artisan Craft & Micro-Enterprise Incubator",
      description:
        "Srijan translates raw talent into sustainable income. We provide hands-on, expert-led workshops in tailoring, advanced beauty services, jewelry crafting, and organic candle and soap making. Beyond the craft, women learn basic financial literacy, pricing, and marketing—giving them the complete toolkit to launch their own micro-enterprises.",
      category: ProgramCategory.COMMUNITY_EMPOWERMENT,
      status: ProgramStatus.ACTIVE,
      startDate: new Date("2024-02-01T00:00:00Z"),
      endDate: new Date("2024-12-31T00:00:00Z"),
      targetBeneficiaries: 200,
      actualBeneficiaries: 45,
      location: "Shahdara Skill Incubator",
      budget: 450000.0,
      imageUrl:
        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=1000",
    },
  });

  // 4. Health & Essentials Distribution
  const program4 = await prisma.program.create({
    data: {
      name: "Drishti & Swasthya: Holistic Community Health",
      description:
        "Health is the foundation of empowerment. We organize monthly comprehensive health and eye-care camps targeting vulnerable families in high-density slum clusters. Alongside free medical checkups, cataract screenings, and medicine distribution, our teams distribute essential hygiene kits, clothing, and school supplies for children to ensure holistic community well-being.",
      category: ProgramCategory.HEALTH_CAMP,
      status: ProgramStatus.ACTIVE,
      startDate: new Date("2023-05-10T00:00:00Z"),
      targetBeneficiaries: 2000,
      actualBeneficiaries: 1240,
      location: "Various Mobile Camps, Delhi",
      budget: 320000.0,
      imageUrl:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000",
    },
  });

  // 5. Children's Education Support
  const program5 = await prisma.program.create({
    data: {
      name: "Udaan: After-School Education & Mentorship",
      description:
        "While we empower mothers, we secure the future of their children. Udaan provides after-school tutoring, mentorship, and exam preparation for first-generation learners. By keeping youth engaged in education and away from street-level risks, we break the generational cycle of poverty.",
      category: ProgramCategory.EDUCATION,
      status: ProgramStatus.PLANNED, // Showing a planned state for UI variety
      startDate: new Date("2024-08-01T00:00:00Z"),
      targetBeneficiaries: 300,
      location: "North East Delhi",
      budget: 200000.0,
      imageUrl:
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000",
    },
  });

  console.log(" Successfully seeded 5 real-world programs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
