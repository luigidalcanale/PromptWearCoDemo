export type SeedUser = {
  id: string;
  name: string;
  email: string;
  city: string;
  country: string;
  avatar: string;
};

const NAMES = [
  "Maya Johnson", "Jordan Lee", "Priya Patel", "Liam Schmidt", "Sofia Rossi",
  "Hiro Tanaka", "Aiyana Tsosie", "Noah Bennett", "Elena Vasquez", "Marcus Cole",
  "Yuki Sato", "Adaeze Okafor", "Bilal Haddad", "Chloe Martin", "Diego Alvarez",
  "Esme Laurent", "Finn O'Connor", "Grace Park", "Henrik Olsen", "Isla MacLeod",
  "Jin Park", "Kira Novak", "Leo Becker", "Mira Singh", "Nasir Ahmed",
  "Olivia Brown", "Pablo Castro", "Quinn Reilly", "Rohan Desai", "Sienna Wright",
];

const CITIES: [string, string][] = [
  ["Berlin", "DE"], ["Toronto", "CA"], ["Mumbai", "IN"], ["Hamburg", "DE"], ["Milan", "IT"],
  ["Osaka", "JP"], ["Phoenix", "US"], ["Brooklyn", "US"], ["Madrid", "ES"], ["Austin", "US"],
  ["Tokyo", "JP"], ["Lagos", "NG"], ["Beirut", "LB"], ["Lyon", "FR"], ["Mexico City", "MX"],
  ["Paris", "FR"], ["Dublin", "IE"], ["Seoul", "KR"], ["Oslo", "NO"], ["Edinburgh", "GB"],
  ["Vancouver", "CA"], ["Prague", "CZ"], ["Munich", "DE"], ["Bangalore", "IN"], ["Cairo", "EG"],
  ["Sydney", "AU"], ["Lisbon", "PT"], ["Dublin", "IE"], ["Pune", "IN"], ["Auckland", "NZ"],
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "");

export const USERS: SeedUser[] = NAMES.map((name, i) => {
  const [city, country] = CITIES[i % CITIES.length];
  const handle = slug(name);
  return {
    id: `u_${i + 1}`,
    name,
    email: `${handle}@${["gmail.com", "outlook.com", "proton.me", "fastmail.com"][i % 4]}`,
    city,
    country,
    avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(handle)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
  };
});

export function pickUser(seed?: number): SeedUser {
  const idx = seed == null ? Math.floor(Math.random() * USERS.length) : seed % USERS.length;
  return USERS[idx];
}

export function userById(id: string): SeedUser | undefined {
  return USERS.find((u) => u.id === id);
}
