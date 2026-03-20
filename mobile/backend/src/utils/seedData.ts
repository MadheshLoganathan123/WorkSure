import * as profileService from '../services/profile.service';
import * as walletService from '../services/wallet.service';
import * as claimsService from '../services/claims.service';
import { supabase } from '../utils/supabaseClient';
import logger from './logger';

/**
 * Seed development data for mobile backend.
 * Cleans existing data and creates new rich sample profiles, wallets, transactions, and claims.
 */
export const seedDevelopmentData = async (): Promise<void> => {
  try {
    logger.info('🧹 Cleaning existing development data...');
    
    // Ordered deletion to handle foreign key constraints if any (Supabase usually handles this but good practice)
    await supabase.from('transactions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('claims').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('wallets').delete().neq('user_id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    logger.info('🌱 Seeding rich development data...');

    // ── Sample Profiles ──────────────────────────────────────────────────
    const profiles = [
      { id: '00000000-0000-0000-0000-000000000001', name: 'Rajesh Kumar', persona: 'daily-wage' as const, location: 'Delhi', avgEarnings: 500, workingHours: 8 },
      { name: 'Priya Sharma', persona: 'gig-worker' as const, location: 'Mumbai', avgEarnings: 800, workingHours: 10 },
      { name: 'Amit Patel', persona: 'self-employed' as const, location: 'Bangalore', avgEarnings: 1200, workingHours: 9 },
      { name: 'Sunita Devi', persona: 'domestic-worker' as const, location: 'Chennai', avgEarnings: 400, workingHours: 6 },
    ];

    const createdProfiles = [];
    for (const p of profiles) {
        if ((p as any).id === '00000000-0000-0000-0000-000000000001') {
            const { data } = await supabase.from('profiles').insert([p]).select().single();
            createdProfiles.push(data);
        } else {
            createdProfiles.push(await profileService.createProfile(p));
        }
    }
    logger.info(`✅ Created ${createdProfiles.length} sample profiles`);

    // ── Sample Wallets & Transactions ────────────────────────────────────
    const txnDescriptions = [
        'Evening shift payout',
        'Morning shift delivery',
        'Bonus incentive',
        'Survey participation',
        'Withdrawal to Bank',
        'Grocery payment',
        'Fuel refill',
        'Monthly platform fee',
        'Referral reward'
    ];

    for (const [index, profile] of createdProfiles.entries()) {
      // 1. Initial Balance
      await walletService.processTopup(profile.id, 2000, 'Joining Bonus');

      // 2. Generate 15 varied transactions
      for (let i = 0; i < 15; i++) {
          const type = Math.random() > 0.4 ? 'topup' : 'withdrawal';
          const amount = Math.floor(Math.random() * 400) + 100;
          const desc = txnDescriptions[Math.floor(Math.random() * txnDescriptions.length)];
          const timestamp = new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString();
          
          await supabase.from('transactions').insert([{
              user_id: profile.id,
              type,
              amount,
              status: 'completed',
              description: desc,
              timestamp
          }]);

          // Sync wallet balance
          const wallet = await walletService.getOrCreateWallet(profile.id);
          const newBalance = type === 'topup' ? wallet.balance + amount : wallet.balance - amount;
          const newEarnings = type === 'topup' ? wallet.totalEarnings + amount : wallet.totalEarnings;
          await supabase.from('wallets').update({ 
            balance: newBalance, 
            total_earnings: newEarnings,
            updated_at: new Date().toISOString()
          }).eq('user_id', profile.id);
      }
    }
    logger.info(`✅ Created 60 transactions across users`);

    // ── Sample Claims ────────────────────────────────────────────────────
    const claimTypes = [
        { type: 'Heavy Rain', reason: 'Extreme Rainfall Alert' },
        { type: 'Heat Wave', reason: 'Severe Heatwave Alert' },
        { type: 'AQI Alert', reason: 'Hazardous Air Quality' }
    ];

    for (const profile of createdProfiles) {
        for (let i = 0; i < 6; i++) {
            const claimInfo = claimTypes[Math.floor(Math.random() * claimTypes.length)];
            const status = i === 0 ? 'Pending' : (i < 3 ? 'Approved' : 'Paid');
            const amount = 300 + Math.floor(Math.random() * 600);
            const triggeredAt = new Date(Date.now() - (i * 5 * 24 * 60 * 60 * 1000)).toISOString();

            await supabase.from('claims').insert([{
                user_id: profile.id,
                status,
                amount,
                reason: claimInfo.reason,
                weather_condition: claimInfo.type,
                triggered_at: triggeredAt,
                approved_at: status !== 'Pending' ? new Date(new Date(triggeredAt).getTime() + 3600000).toISOString() : null,
                paid_at: status === 'Paid' ? new Date(new Date(triggeredAt).getTime() + 7200000).toISOString() : null
            }]);
            
            // If paid, add to wallet
            if (status === 'Paid') {
                const wallet = await walletService.getOrCreateWallet(profile.id);
                await supabase.from('wallets').update({ 
                    balance: wallet.balance + amount,
                    total_earnings: wallet.totalEarnings + amount 
                }).eq('user_id', profile.id);
                
                await supabase.from('transactions').insert([{
                    user_id: profile.id,
                    type: 'topup',
                    amount,
                    status: 'completed',
                    description: `Claim Payout: ${claimInfo.type}`,
                    timestamp: new Date(new Date(triggeredAt).getTime() + 7200000).toISOString()
                }]);
            }
        }
    }

    logger.info(`✅ Created 24 sample claims`);
    logger.info('🎉 Enriched development data seeding completed successfully!');
  } catch (error) {
    logger.error('❌ Error seeding development data:', error);
    throw error;
  }
};
