const SEED = [];
const store = globalThis.__sableLeads || { leads: [] };
globalThis.__sableLeads = store;
if (!store.leads.length && SEED.length) {
  store.leads = SEED.slice();
}
