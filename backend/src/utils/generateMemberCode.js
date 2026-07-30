import { query } from '../config/db.js';

const PREFIX_MAP = { AGENT: 'AGN', RESELLER: 'RSL', MEMBER: 'MBR' };

export async function generateMemberCode(categoryCode = 'MEMBER') {
  const prefix = PREFIX_MAP[categoryCode] || 'MBR';
  const seqRes = await query(`SELECT nextval('member.member_code_seq') AS seq`);
  const seq = seqRes.rows[0].seq;
  return `${prefix}${String(seq).padStart(8, '0')}`;
}