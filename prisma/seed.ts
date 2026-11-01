import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const YEAR = 2026

const texts = {
  frontpageHeading: `Velkommen til Musikkjulekalender ${YEAR}!`,
  frontpageMessage:
    'Hver dag fra 1. til 24. desember åpner en ny luke med en musikalsk nøtt. Lytt godt, gjett artist og låt, og samle poeng – jo raskere du svarer, desto flere poeng får du. Lykke til, og god jul!',
}

async function seedTexts() {
  const existing = await prisma.texts.findFirst()
  if (existing) {
    await prisma.texts.update({ where: { id: existing.id }, data: texts })
    console.log(`Updated texts (id ${existing.id})`)
  } else {
    const created = await prisma.texts.create({ data: texts })
    console.log(`Created texts (id ${created.id})`)
  }
}

async function seedDays() {
  for (let day = 1; day <= 24; day++) {
    // Days open at 08:00 UTC, matching utils/dates.ts getToday()
    const date = new Date(Date.UTC(YEAR, 11, day, 8, 0, 0, 0))

    const existing = await prisma.day.findFirst({ where: { date } })
    if (existing) {
      console.log(`Day ${day} already exists (id ${existing.id}), skipping`)
      continue
    }

    const created = await prisma.day.create({
      data: {
        date,
        artist: 'TBA',
        song: 'TBA',
        description: `Luke ${day}`,
        difficulty: 1,
        madeBy: '',
        hasFileHint1: false,
        hasFileHint2: false,
        hasFileHint3: false,
        file: { create: { file: '' } },
      },
    })
    console.log(`Created day ${day} (id ${created.id})`)
  }
}

async function main() {
  console.log(`Start seeding ...`)
  await seedTexts()
  await seedDays()
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
