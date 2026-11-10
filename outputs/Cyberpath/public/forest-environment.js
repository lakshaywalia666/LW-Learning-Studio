const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export const WEATHER_REFRESH=30*60*1000;
export const WEATHER_MAX_AGE=3*60*60*1000;
export function validateForestEnvironment(value={}){
 if(!value||typeof value!=='object'||Array.isArray(value))throw new Error('Invalid forest environment.');
 if(value.enabled!==undefined&&typeof value.enabled!=='boolean')throw new Error('Invalid forest weather preference.');
 if(value.place){const p=value.place;if(!Number.isFinite(p.latitude)||Math.abs(p.latitude)>90||!Number.isFinite(p.longitude)||Math.abs(p.longitude)>180||typeof p.name!=='string'||p.name.length>160||!['phone','city'].includes(p.source))throw new Error('Invalid forest weather area.');if(p.timezone)try{new Intl.DateTimeFormat('en',{timeZone:p.timezone});}catch{throw new Error('Invalid weather timezone.');}}
 if(value.weather){const w=value.weather;for(const key of ['fetchedAt','observedAt','code','temperature','wind'])if(!Number.isFinite(w[key]))throw new Error('Invalid cached forest weather.');if(w.fetchedAt<0||w.observedAt<0||w.code<0||w.code>99||w.wind<0||w.wind>500||w.temperature< -100||w.temperature>100)throw new Error('Invalid cached forest weather.');for(const key of ['sunrise','sunset','precipitation'])if(w[key]!==undefined&&(!Number.isFinite(w[key])||w[key]<0))throw new Error('Invalid cached forest weather.');if(w.isDay!==undefined&&typeof w.isDay!=='boolean')throw new Error('Invalid daylight flag.');}
 return value;
}
export function roundedPlace(latitude,longitude,name='Phone area',source='phone',timezone=''){
 const p={latitude:Math.round(Number(latitude)*100)/100,longitude:Math.round(Number(longitude)*100)/100,name:String(name).slice(0,160),source,timezone};validateForestEnvironment({place:p});return p;
}
export function weatherKind(code,precipitation=0){
 if([95,96,99].includes(code))return{kind:'rain',label:'Thunderstorms',intensity:.9};
 if([71,73,75,77,85,86].includes(code))return{kind:'snow',label:'Snow',intensity:code===75||code===86?.8:.4};
 if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)||precipitation>.05)return{kind:'rain',label:[51,53,55,56,57].includes(code)?'Drizzle':code===65||code===82?'Heavy rain':'Rain',intensity:[65,67,82].includes(code)?1:[51,53,55].includes(code)?.28:.6};
 if([45,48].includes(code))return{kind:'fog',label:'Fog',intensity:.7};
 if(code===3)return{kind:'cloud',label:'Overcast',intensity:.85};
 if(code===1||code===2)return{kind:'cloud',label:'Partly cloudy',intensity:.35};
 return{kind:'clear',label:'Clear',intensity:0};
}
function localHour(now,timezone){if(!timezone)return now.getHours()+now.getMinutes()/60;const parts=new Intl.DateTimeFormat('en-GB',{timeZone:timezone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(now);return Number(parts.find(p=>p.type==='hour').value)+Number(parts.find(p=>p.type==='minute').value)/60;}
export function forestEnvironment(settings={},now=new Date(),preview='auto'){
 validateForestEnvironment(settings);const weather=settings.enabled?settings.weather:null,age=weather?now.getTime()-weather.fetchedAt:Infinity,fresh=Boolean(weather&&age>=-60000&&age<=WEATHER_MAX_AGE&&Math.abs(now.getTime()-weather.observedAt)<WEATHER_MAX_AGE),timezone=settings.enabled?settings.place?.timezone:'',hour=localHour(now,timezone);
 let sunrise=6.5,sunset=18.5;
 if(weather&&weather.sunrise&&weather.sunset&&Math.abs(now.getTime()-weather.sunrise)<24*60*60*1000){sunrise=localHour(new Date(weather.sunrise),timezone);sunset=localHour(new Date(weather.sunset),timezone);}
 let phase='night',daylight=0;
 if(hour>=sunrise+.65&&hour<sunset-.65){phase='day';daylight=1;}
 else if(hour>=sunrise-.7&&hour<sunrise+.65){phase='dawn';daylight=clamp((hour-sunrise+.7)/1.35,0,1);}
 else if(hour>=sunset-.65&&hour<sunset+.7){phase='dusk';daylight=1-clamp((hour-sunset+.65)/1.35,0,1);}
 if(fresh&&(!weather.sunrise||!weather.sunset)&&typeof weather.isDay==='boolean'){phase=weather.isDay?'day':'night';daylight=weather.isDay?1:0;}
 let atmosphere=fresh?weatherKind(weather.code,weather.precipitation):{kind:'clear',label:'Time only',intensity:0};
 if(preview==='day'){phase='day';daylight=1;atmosphere=weatherKind(0);}
 if(preview==='night'){phase='night';daylight=0;atmosphere=weatherKind(0);}
 if(preview==='rain'){phase='day';daylight=.65;atmosphere=weatherKind(63);}
 if(preview==='snow'){phase='day';daylight=.8;atmosphere=weatherKind(73);}
 return{phase,daylight,...atmosphere,wind:fresh?weather.wind:5,temperature:fresh?weather.temperature:null,preview:preview!=='auto',hour,fresh,age,place:settings.enabled?settings.place?.name:'Phone clock',status:preview!=='auto'?'Atmosphere preview':fresh?(age>WEATHER_REFRESH?'Saved weather':'Current weather'):weather?'Weather unavailable · time only':'Time only',clock:new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit',...(timezone?{timeZone:timezone}:{})}).format(now)};
}
export function normaliseWeather(payload,now=Date.now()){
 const c=payload.current;if(!c||!Number.isFinite(c.weather_code)||!Number.isFinite(c.temperature_2m)||!Number.isFinite(c.wind_speed_10m)||!Number.isFinite(c.time))throw new Error('Weather response was incomplete.');
 const w={fetchedAt:now,observedAt:c.time*1000,code:c.weather_code,temperature:c.temperature_2m,wind:c.wind_speed_10m,precipitation:Number(c.precipitation)||0,isDay:c.is_day===1,sunrise:Number(payload.daily?.sunrise?.[0])*1000||0,sunset:Number(payload.daily?.sunset?.[0])*1000||0};validateForestEnvironment({weather:w});return w;
}
async function getJSON(url,signal){const response=await fetch(url,{signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok)throw new Error('Weather service is unavailable. Your forest still works offline.');return response.json();}
export async function searchWeatherPlaces(query,{signal}={}){
 if(String(query).trim().length<2)throw new Error('Enter at least two letters of a city.');
 const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.search=new URLSearchParams({name:String(query).trim().slice(0,100),count:'6',language:'en',format:'json'});
 const json=await getJSON(url,signal);return(json.results||[]).map(r=>roundedPlace(r.latitude,r.longitude,[r.name,r.admin1,r.country].filter(Boolean).join(', '),'city',r.timezone));
}
export async function fetchForestWeather(place,{signal}={}){
 validateForestEnvironment({place});const area=roundedPlace(place.latitude,place.longitude,place.name,place.source,place.timezone),url=new URL('https://api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:String(area.latitude),longitude:String(area.longitude),current:'temperature_2m,precipitation,weather_code,wind_speed_10m,is_day',daily:'sunrise,sunset',timezone:'auto',timeformat:'unixtime',forecast_days:'1'});
 const json=await getJSON(url,signal);return{weather:normaliseWeather(json),timezone:json.timezone};
}
export function phoneWeatherPlace(){
 return new Promise((resolve,reject)=>{
  if(window.AndroidApp){if(!window.AndroidApp.requestForestLocation){reject(new Error('Choose a city, or update the Android app to use phone location.'));return;}const handler=event=>{clearTimeout(timeout);window.removeEventListener('native-forest-location',handler);try{const p=JSON.parse(event.detail);if(p.error)throw new Error(p.error);resolve(roundedPlace(p.latitude,p.longitude));}catch(error){reject(error);}},timeout=setTimeout(()=>{window.removeEventListener('native-forest-location',handler);reject(new Error('Location took too long. Choose a city or try again.'));},25000);window.addEventListener('native-forest-location',handler);window.AndroidApp.requestForestLocation();return;}
  if(!navigator.geolocation){reject(new Error('Location is unavailable here. Choose a city instead.'));return;}
  navigator.geolocation.getCurrentPosition(position=>resolve(roundedPlace(position.coords.latitude,position.coords.longitude)),()=>reject(new Error('Location was not available. You can choose a city instead.')),{enableHighAccuracy:false,timeout:20000,maximumAge:5*60*1000});
 });
}
