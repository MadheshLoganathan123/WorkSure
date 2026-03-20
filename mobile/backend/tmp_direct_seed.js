const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabase = createClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "");

async function directSeed() {
  console.log("--- Direct Seeding Starting ---");
  const userId = '00000000-0000-0000-0000-000000000001';

  try {
    // 1. Clean
    console.log("Cleaning...");
    await supabase.from('transactions').delete().eq('user_id', userId);
    await supabase.from('claims').delete().eq('user_id', userId);
    await supabase.from('wallets').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('id', userId);

    // 2. Insert Profile
    console.log("Inserting Profile...");
    const { error: pErr } = await supabase.from('profiles').insert([{
      id: userId,
      name: 'Rajesh Kumar',
      persona: 'daily-wage',
      location: 'Delhi',
      avg_earnings: 500,
      working_hours: 8
    }]);
    if (pErr) throw pErr;

    // 3. Insert Wallet
    console.log("Inserting Wallet...");
    const { error: wErr } = await supabase.from('wallets').insert([{
      user_id: userId,
      balance: 1500,
      total_earnings: 2000,
      pending_payouts: 0
    }]);
    if (wErr) throw wErr;

    // 4. Insert Claims
    console.log("Inserting Claims...");
    const { error: cErr } = await supabase.from('claims').insert([
      {
        user_id: userId,
        status: 'Pending',
        amount: 450,
        reason: 'Heavy Rain in Delhi Zone 4',
        weather_condition: 'Heavy Rain',
        triggered_at: new Date().toISOString()
      },
      {
        user_id: userId,
        status: 'Approved',
        amount: 300,
        reason: 'Heat Wave Alert - Delhi NCR',
        weather_condition: 'Heat Wave',
        triggered_at: new Date(Date.now() - 86400000).toISOString(),
        approved_at: new Date().toISOString()
      }
    ]);
    if (cErr) throw cErr;

    console.log("--- Direct Seeding Finished Successfully ---");
  } catch (err) {
    console.error("Direct Seeding FAILED:", err);
    process.exit(1);
  }
}

directSeed();
