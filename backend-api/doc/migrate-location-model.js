const mongoose = require('mongoose');

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://localhost:27017/assets_management';

const DRY_RUN = process.env.DRY_RUN === 'true';

async function migrate() {
  await mongoose.connect(MONGO_URI);

  const db = mongoose.connection.db;

  const regions = db.collection('regions');
  const townships = db.collection('townships');

  console.log('====================================');
  console.log('Location Migration');
  console.log('====================================');
  console.log(`Database: ${db.databaseName}`);
  console.log(`Dry run: ${DRY_RUN}`);
  console.log('====================================');

  // =========================================================
  // 1. CLEAN REGIONS
  // =========================================================

  console.log('\n=== Regions ===');

  const regionDocs = await regions.find({}).toArray();

  const regionMap = new Map();

  for (const doc of regionDocs) {
    const code =
      doc.code ||
      doc.pcode ||
      doc.SR_Pcode;

    const name =
      doc.name ||
      doc.State_Region;

    const nameMm =
      doc.nameMm ||
      doc.nameMya ||
      doc.State_Region_MYA_MM3 ||
      '';

    if (!code || !/^MMR\d{3}$/.test(String(code))) {
      console.log(
        `SKIP REGION ${doc._id}: invalid code ${code}`
      );
      continue;
    }

    const cleanRegion = {
      _id: doc._id,

      name: String(name).trim(),

      nameMm: String(nameMm).trim(),

      code: String(code)
        .trim()
        .toUpperCase(),

      description:
        doc.description ??
        doc.Remark ??
        '',

      createdAt:
        doc.createdAt || new Date(),

      updatedAt: new Date()
    };

    // Always build map, even in dry-run
    regionMap.set(
      cleanRegion.code,
      cleanRegion._id
    );

    if (!DRY_RUN) {
      await regions.replaceOne(
        { _id: doc._id },
        cleanRegion
      );
    }

    console.log(
      `OK ${cleanRegion.code} -> ${cleanRegion.name}`
    );
  }

  console.log(
    `\nLoaded ${regionMap.size} regions`
  );

  // Debug important region
  console.log(
    'MMR013 region:',
    regionMap.get('MMR013')
  );

  // =========================================================
  // 2. CLEAN TOWNSHIPS
  // =========================================================

  console.log('\n=== Townships ===');

  const townshipDocs =
    await townships.find({}).toArray();

  let migrated = 0;
  let skipped = 0;

  for (const doc of townshipDocs) {

    // -----------------------------------------
    // Original Excel fields
    // -----------------------------------------

    const name =
      doc.name ||
      doc.Township;

    const nameMm =
      doc.nameMm ||
      doc.nameMya ||
      doc.Township_MMA ||
      '';

    const townshipPcode =
      doc.pcode ||
      doc.TS_Pcode;

    // -----------------------------------------
    // IMPORTANT
    //
    // DO NOT USE SR_Pcode
    //
    // SR_Pcode contains literal:
    // "SR_Pcode"
    //
    // Instead:
    //
    // MMR013009
    // ↓
    // MMR013
    // -----------------------------------------

    if (
      !townshipPcode ||
      !/^MMR\d{6}$/.test(
        String(townshipPcode)
      )
    ) {
      console.log(
        `SKIP ${doc._id}: invalid TS_Pcode`,
        townshipPcode
      );

      skipped++;
      continue;
    }

    const regionCode =
      String(townshipPcode)
        .substring(0, 6);

    const regionId =
      regionMap.get(regionCode);

    if (!regionId) {
      console.log(
        `SKIP ${doc._id}: region not found`,
        {
          name,
          townshipPcode,
          regionCode
        }
      );

      skipped++;
      continue;
    }

    if (!name) {
      console.log(
        `SKIP ${doc._id}: missing name`
      );

      skipped++;
      continue;
    }

    // -----------------------------------------
    // Clean document according to current model
    // -----------------------------------------

    const cleanTownship = {
      _id: doc._id,

      name: String(name).trim(),

      nameMm: String(nameMm).trim(),

      region: regionId,

      description:
        doc.description ??
        doc.Remark ??
        '',

      createdAt:
        doc.createdAt || new Date(),

      updatedAt: new Date()
    };

    if (!DRY_RUN) {
      await townships.replaceOne(
        { _id: doc._id },
        cleanTownship
      );
    }

    migrated++;

    console.log(
      `OK ${cleanTownship.name} -> ${regionCode}`
    );
  }

  // =========================================================
  // 3. INDEXES
  // =========================================================

  if (!DRY_RUN) {

    console.log('\n=== Indexes ===');

    // Remove old index if it exists
    try {
      await townships.dropIndex(
        'region_name_unique'
      );

      console.log(
        'Dropped old region_name_unique'
      );
    } catch (error) {
      // Index may not exist
    }

    await regions.createIndex(
      { code: 1 },
      {
        unique: true,
        name: 'code_unique'
      }
    );

    await townships.createIndex(
      { region: 1, name: 1 },
      {
        unique: true,
        name: 'region_name_unique'
      }
    );

    console.log(
      'Indexes created'
    );
  }

  // =========================================================
  // SUMMARY
  // =========================================================

  console.log('\n====================================');
  console.log('Migration finished');
  console.log('====================================');

  console.log(
    `Regions       : ${regionMap.size}`
  );

  console.log(
    `Townships OK  : ${migrated}`
  );

  console.log(
    `Townships skip: ${skipped}`
  );

  console.log(
    `Dry run       : ${DRY_RUN}`
  );

  console.log(
    '===================================='
  );

  await mongoose.disconnect();
}

migrate().catch(async error => {

  console.error('\nMigration failed:');
  console.error(error);

  try {
    await mongoose.disconnect();
  } catch (_) {}

  process.exit(1);
});