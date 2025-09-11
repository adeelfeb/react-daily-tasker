// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://event-calendar-five.vercel.app/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Event Types
export const EVENT_TYPES = {
  MEETING: 'meeting',
  TASK: 'task',
  REMINDER: 'reminder',
  OTHER: 'other'
};

// Calendar Views
export const CALENDAR_VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  AGENDA: 'agenda'
};

// UK Cities
export const UK_CITIES = [
  // England - Major Cities
  "London", "Birmingham", "Manchester", "Leeds", "Sheffield", "Bradford", "Liverpool", "Bristol", "Coventry", "Leicester",
  "Nottingham", "Newcastle upon Tyne", "Stoke-on-Trent", "Southampton", "Derby", "Portsmouth", "Brighton and Hove", "Plymouth", "Northampton", "Reading",
  "Luton", "Wolverhampton", "Bolton", "Bournemouth", "Norwich", "Swindon", "Huddersfield", "York", "Ipswich", "Blackpool",
  "Middlesbrough", "Hull", "West Bromwich", "Peterborough", "Stockport", "Stoke-on-Trent", "Telford", "Exeter", "Southend-on-Sea", "Walsall",
  "Maidstone", "Blackburn", "Oldham", "Woking", "Cheltenham", "Chelmsford", "Colchester", "Crawley", "Gillingham", "Basingstoke",
  "Worcester", "Maidstone", "Rotherham", "Stockton-on-Tees", "Worthing", "Hastings", "Mansfield", "Oxford", "Ipswich", "Slough",
  "Eastbourne", "Blackpool", "Gloucester", "Telford", "Southend-on-Sea", "Walsall", "Maidstone", "Blackburn", "Oldham", "Woking",
  "Cheltenham", "Chelmsford", "Colchester", "Crawley", "Gillingham", "Basingstoke", "Worcester", "Maidstone", "Rotherham", "Stockton-on-Tees",
  "Worthing", "Hastings", "Mansfield", "Oxford", "Ipswich", "Slough", "Eastbourne", "Blackpool", "Gloucester", "Telford",
  
  // Scotland - Major Cities
  "Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Stirling", "Perth", "Inverness", "Dumfries", "Ayr", "Kilmarnock",
  "Greenock", "Paisley", "Hamilton", "Coatbridge", "Motherwell", "Livingston", "Kirkcaldy", "Dunfermline", "Airdrie", "Falkirk",
  
  // Wales - Major Cities
  "Cardiff", "Swansea", "Newport", "Wrexham", "Barry", "Caerphilly", "Rhondda", "Merthyr Tydfil", "Bridgend", "Port Talbot",
  "Llanelli", "Aberdare", "Neath", "Cwmbran", "Pontypridd", "Caernarfon", "Bangor", "Llandudno", "Colwyn Bay", "Rhyl",
  
  // Northern Ireland - Major Cities
  "Belfast", "Derry", "Lisburn", "Newry", "Armagh", "Coleraine", "Carrickfergus", "Larne", "Ballymena", "Antrim",
  "Newtownabbey", "Craigavon", "Banbridge", "Dungannon", "Strabane", "Omagh", "Enniskillen", "Downpatrick", "Ballyclare", "Crumlin"
];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme'
};
