// Script de test pour vérifier les APIs directement
// Usage: node test-api.js

const axios = require('axios');

const API_FOOTBALL_KEY = '8f1ae6fbb6msh1c7506d876c27f5p1b79a2jsn79a469b04574';
const FOOTBALL_DATA_KEY = '48b3e12dda0a4f6eb0e983abe4388681';

// Date d'aujourd'hui
const today = new Date().toISOString().split('T')[0];

console.log('🧪 Testing APIs for date:', today);
console.log('=====================================\n');

// Test 1: API-Football (RapidAPI)
async function testApiFootball() {
  console.log('📡 Testing API-Football (RapidAPI)...');
  try {
    const response = await axios.get('https://api-football-v1.p.rapidapi.com/v3/fixtures', {
      params: { date: today },
      headers: {
        'X-RapidAPI-Key': API_FOOTBALL_KEY,
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
      },
      timeout: 10000
    });
    
    console.log('✅ API-Football Status:', response.status);
    const matches = response.data?.response || [];
    console.log('📊 API-Football Matches found:', matches.length);
    if (matches.length > 0) {
      console.log('📋 First match:', matches[0].teams?.home?.name, 'vs', matches[0].teams?.away?.name);
    }
    return matches.length;
  } catch (error) {
    console.error('❌ API-Football Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return 0;
  }
}

// Test 2: Football-Data.org (via proxy local)
async function testFootballData() {
  console.log('\n📡 Testing Football-Data.org (via proxy)...');
  console.log('⚠️  Make sure proxy server is running: npm run proxy');
  
  try {
    const response = await axios.get('http://localhost:3001/api/football-data/v4/matches', {
      params: {
        dateFrom: today,
        dateTo: today
      },
      timeout: 10000
    });
    
    console.log('✅ Football-Data.org Status:', response.status);
    const matches = response.data?.matches || [];
    console.log('📊 Football-Data.org Matches found:', matches.length);
    if (response.data?.resultSet) {
      console.log('📊 ResultSet count:', response.data.resultSet.count);
    }
    if (matches.length > 0) {
      console.log('📋 First match:', matches[0].homeTeam?.name, 'vs', matches[0].awayTeam?.name);
    }
    return matches.length;
  } catch (error) {
    console.error('❌ Football-Data.org Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   ⚠️  Proxy server not running! Run: npm run proxy');
    } else if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return 0;
  }
}

// Test 3: OpenLigaDB
async function testOpenLigaDB() {
  console.log('\n📡 Testing OpenLigaDB...');
  try {
    const dateObj = new Date(today);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    // Essayer l'endpoint avec date
    const url = `https://api.openligadb.de/getmatchdata/${year}/${month}/${day}`;
    console.log('🌐 OpenLigaDB URL:', url);
    
    const response = await axios.get(url, {
      timeout: 10000
    });
    
    console.log('✅ OpenLigaDB Status:', response.status);
    const matches = response.data || [];
    
    console.log('📊 OpenLigaDB Matches found for today:', matches.length);
    if (matches.length > 0) {
      console.log('📋 First match:', matches[0].team1?.teamName, 'vs', matches[0].team2?.teamName);
    }
    return matches.length;
  } catch (error) {
    console.error('❌ OpenLigaDB Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return 0;
  }
}

// Exécuter tous les tests
async function runTests() {
  const results = {
    apiFootball: 0,
    footballData: 0,
    openLigaDB: 0
  };
  
  results.apiFootball = await testApiFootball();
  results.footballData = await testFootballData();
  results.openLigaDB = await testOpenLigaDB();
  
  console.log('\n=====================================');
  console.log('📊 SUMMARY:');
  console.log('   API-Football:', results.apiFootball, 'matches');
  console.log('   Football-Data.org:', results.footballData, 'matches');
  console.log('   OpenLigaDB:', results.openLigaDB, 'matches');
  console.log('   TOTAL:', results.apiFootball + results.footballData + results.openLigaDB, 'matches');
  
  if (results.apiFootball + results.footballData + results.openLigaDB === 0) {
    console.log('\n⚠️  No matches found for today. This could be normal if:');
    console.log('   - It\'s an off-day (no matches scheduled)');
    console.log('   - The date is outside the season');
    console.log('   - Your API plan has limited access');
  }
}

runTests().catch(console.error);

