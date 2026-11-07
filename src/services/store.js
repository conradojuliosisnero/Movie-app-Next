// Tienda: stock global, canjes y sorteo del Boleto Dorado en Firestore.
//   storeStock/{itemId}                 = { left }                 stock compartido (se siembra con scripts/seed-store-stock.mjs)
//   storePurchases/{uid}_{itemId}       = { item, price, profile, at }   uno por persona (cuenta)
//   storeRaffle/{semana}/entries/{uid}  = { name, at }             un boleto por persona por semana
// Lo que tiene cada perfil (y cuánto gastó) vive en su lista: lista.store (ver LibraryContext).
// shortcut: el saldo se calcula en el navegador (igual que el ranking): las reglas impiden llevarse más
// stock del que hay o repetir un artículo, pero no validan el saldo. Para eso, canjear desde el servidor.
import { collection, doc, getCountFromServer, getDocs, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { weekKey } from './ranking';

export async function loadStock() {
  const snap = await getDocs(collection(db, 'storeStock'));
  return Object.fromEntries(snap.docs.map((d) => [d.id, d.data().left ?? 0]));
}

/** Canjea en una transacción: descuenta 1 del stock y anota la compra. Lanza 'owned' o 'soldout'. */
export function claimItem({ uid, profileId, itemId, price }) {
  return runTransaction(db, async (tx) => {
    const stockRef = doc(db, 'storeStock', itemId);
    const buyRef = doc(db, 'storePurchases', `${uid}_${itemId}`);
    const [stock, bought] = [await tx.get(stockRef), await tx.get(buyRef)];
    if (bought.exists()) throw new Error('owned');
    if (!stock.exists() || (stock.data().left ?? 0) <= 0) throw new Error('soldout');
    tx.update(stockRef, { left: stock.data().left - 1 });
    tx.set(buyRef, { item: itemId, price, profile: profileId, at: serverTimestamp() });
  });
}

const entries = () => collection(db, 'storeRaffle', weekKey(), 'entries');
export const raffleCount = async () => (await getCountFromServer(entries())).data().count;
export const joinRaffle = ({ uid, name }) => setDoc(doc(entries(), uid), { name: String(name).slice(0, 40), at: serverTimestamp() });
