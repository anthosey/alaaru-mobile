import { Injectable } from '@angular/core';
import { MiniRequest } from '../new-request/miniRequest.model';
import { ServiceTypes } from '../new-request/model/service.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ItemDescription } from '../new-request/description/description.model';
import { FullRequest } from '../new-request/full-request.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { tap, map, switchMap, take } from 'rxjs/operators';
import { VehicleTypes } from '../vehicle-types/vehicle.model';
import { City } from '../inside/city.model';
import { CityServices } from '../new-request/inter-city/cityServices.model';
import { Country } from '../auth/model/country';
import { AuthService } from './auth.service';
import { pipe } from 'rxjs';
import { Positions } from '../model/positions';
import { OnlineUsers } from '../model/online-user';
import { Observable } from 'rxjs/Observable';

interface PaystackResponseData {
  data: {
    access_code: string,
    reference: string,
    authorization_url: string
  };
  status: string;
  message: string;
  }

interface AllItemRes {
  status: string;
  data: {
          id: number,
          category: string,
          item_code: string,
          weight: string,
          item_name: string,
          online: string,
          weight_price: number,
          createdAt: Date,
          updatedAt: Date
      };
  }

interface AllServiceRes {
    status: string;
    data: [{
            id: number,
            service_type: string,
            price: string,
            createdAt: Date,
            updatedAt: Date
        }];
    }
    
@Injectable({
  providedIn: 'root'
})
export class RequestService {
estimate = 0;
miniRequest: MiniRequest;
itemDescription: ItemDescription;

fullRequest: FullRequest [] = [];
onlineVehicles: VehicleTypes[] = [];
countries: Country[] = [{countryName: 'Nigeria', countryCode: 'ng', flagUrl:'assets/img/nigeria.svg', phoneCode: '+234'},
                      {countryName: 'Ghana', countryCode: 'gh', flagUrl:'assets/img/ghana.svg', phoneCode: '+233'},]
serviceTypes: ServiceTypes[] = [{serviceType: 'Standard pickup', price: 3000 },
                                {serviceType: "Instant pickup", price: 1500 },
                                {serviceType: "Schedule", price: 700}];
onlineUsers: OnlineUsers[] = [
  { name: 'Tony Kole', phone: '08038094457', picture: 'assets/img/driver.svg', rating: 4, vehicleType: 'Car', vehicleReg: 'FF110ABC',
  vehicleDescription: 'Mazda Salon', lat: 9.0543582, lng: 7.4742423, eta: 5},

  { name: 'Iredia Idalu', phone: '09032112212', picture: 'assets/img/driver2.svg', rating: 4, vehicleType: 'Mini Van', vehicleReg: 'CZ660BE',
  vehicleDescription: 'Toyota Hilux', lat: 9.0603591, lng: 7.4570506000000005, eta: 5},

  { name: 'Segun Braimo', phone: '08038094458', picture: 'assets/img/driver_lady.svg', rating: 5, vehicleType: 'Mini Van', vehicleReg: 'BW230GL',
  vehicleDescription: 'J5 Bus', lat: 9.0611509, lng: 7.4972355, eta: 5},

  { name: 'Emmanuel Adeoye', phone: '07065225525', picture: 'assets/img/driver_lady2.svg', rating: 5, vehicleType: 'Car', vehicleReg: 'XC280KJ',
  vehicleDescription: 'Toyota Camry', lat: 9.1373103, lng: 7.3685952, eta: 5}
];

findDriver(ref: string, serviceOption: string, pickupLat: number, pickupLng: number, vehicleType: string) {
  let driver: string;

return this.getClosestDriver(pickupLat, pickupLng,vehicleType);
}

simpleObservable = new Observable((observer) => {
    
  // observable execution
  observer.next("bla bla bla")
  observer.complete()
})

getClosestDriver(pickupLat: number, pickupLng: number, vehicleType: string){
  let distanceArray: number[] = [];
  let positionArray: number[] = [];

  for (let i = 0; i < this.onlineUsers.length; i++) {
    let lat2 = this.onlineUsers[i].lat;
    let lng2 = this.onlineUsers[i].lng;
    if (vehicleType === this.onlineUsers[i].vehicleType) {
      var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(pickupLat, pickupLng), new google.maps.LatLng(lat2, lng2));   
      console.log('Driver ' + i + ': ' + this.onlineUsers[i].name + ', Dist:' + distance);
      distanceArray.push(distance);
      positionArray.push(i);
      // return this.onlineUsers[i];
    }
  }

  //  let outVals = google.maps.DistanceMatrixService.arguments(new google.maps.LatLng(pickupLat,pickupLng), new google.maps.LatLng(lat2, lng2));
  //        console.log('matrix: ' + outVals);

  if (distanceArray.length < 1) {
    // no driver found
  } else {if (distanceArray.length === 1) {
    const position = positionArray[0];
    return this.onlineUsers[position];
  }else { // drivers found is more than 1
    let lowestDistance = Math.min(...distanceArray);
    let lowestDistancePosition = distanceArray.indexOf(Math.min(...distanceArray));
    let closestDriverPosition = positionArray[lowestDistancePosition];
    let closestDiver = this.onlineUsers[closestDriverPosition];
    closestDiver.eta  = Math.round(lowestDistance/10); // needed to be worked on
    return closestDiver;
  }
}
  
}


getVehicleTypesOnline(pickupLat: number, pickupLng: number) {
  this.onlineVehicles = [];
  for (let i = 0; i < this.vehicleTypes.length; i++) {
    const vehicle = this.vehicleTypes[i].vehicleType;
    if (this.onlineUsers.find(ou => ou.vehicleType === vehicle)) {
      console.log('YEs it is here: ' +  i);
      // const vT = new VehicleTypes(1,'car', 'Toyota Corolla','',2000, true,true);
      const closestDriver = this.getClosestDriver(pickupLat, pickupLng, vehicle)
      let vehicleNow = this.vehicleTypes[i];
      vehicleNow.baseEta = closestDriver.eta;
      this.onlineVehicles.push(vehicleNow);
    }
  }
  return [...this.onlineVehicles];
}


vehicleTypes: VehicleTypes[] = [
                                  {id: 1, 
                                  vehicleType: 'Bike', 
                                  vehicleDescription: 'Recommended for items like documents and light-weight parcel', 
                                  imageUrl: 'assets/img/bike.svg',
                                  basePrice: 200,
                                  allowFullVehicleCapacity: false,
                                  humanAccompany: false,
                                  baseEta: 5,
                                  smallImageUrl: 'assets/img/bike_small.svg'
                                },
                              {
                                id: 2,
                                vehicleType: 'Car',
                                vehicleDescription: 'Recommended for items suitable for car boot or back seat such as TV Set, bag of clothes, microwave oven etc',
                                imageUrl: 'assets/img/car.svg',
                                basePrice: 500,
                                allowFullVehicleCapacity: true,
                                humanAccompany: true,
                                baseEta: 6,
                                smallImageUrl: 'assets/img/car_small.svg'
                              },
                              {
                                id: 3,
                                vehicleType: 'Mini Van',
                                vehicleDescription: 'Recommended for items such as Refrigerators  etc',
                                imageUrl: 'assets/img/van.svg',
                                basePrice: 2000,
                                allowFullVehicleCapacity: true,
                                humanAccompany: true,
                                baseEta: 12,
                                smallImageUrl: 'assets/img/van_small.svg'
                              },

                              {
                                id: 4,
                                vehicleType: 'Pickup',
                                vehicleDescription: 'Recommended for items such as Farm produce, home furnitures, etc.',
                                imageUrl: 'assets/img/pickup.svg',
                                basePrice: 2000,
                                allowFullVehicleCapacity: true,
                                humanAccompany: true,
                                baseEta: 12,
                                smallImageUrl: 'assets/img/pickup_small.svg'
                              },
                              {
                                id: 5,
                                vehicleType: 'Truck',
                                vehicleDescription: 'Recommended for big items or complete home or office moving',
                                imageUrl: 'assets/img/lorry.svg',
                                basePrice: 5000,
                                allowFullVehicleCapacity: true,
                                humanAccompany: true,
                                baseEta: 24,
                                smallImageUrl: 'assets/img/lorry_small.svg'
                              }
                            ];

private vehicleOption: string;
private _fullVehicleCapacity = false;
accompanyOption = 'Nobody';
private _cityOption = 'Abuja, Nigeria';
private _selectedCountry = "ng";

private _boundaryLat = 9.0764785;
private _boundaryLng = 7.398574000000053;
private _logisticsType: string;
cityServices: CityServices[];
_interstate_ServiceOption: string;
_interstate_CityFrom: string;
_interstate_CityTo: string;


// New design values 
private _pickupLocation: Positions;
private _pickupAddress: string;

private _deliveryLocation: Positions;
private _deliveryAddress: string;
private _pickupCity: string;
private _deliveryCity: string;

//End of new Design values

cities: City[] = [
                  {cityName: 'Lagos', country:'Nigeria', doorToDoor: true}, 
                  {cityName: 'Federal Capital Territory', country:'Nigeria', doorToDoor: true},
                  {cityName: 'Rivers', country:'Nigeria', doorToDoor: true},
                  {cityName: 'Oyo', country:'Nigeria', doorToDoor: false},];


_cardActive = true;
set cardActive(val: boolean) {
  this._cardActive = val;
}

get cardActive() {
  return this._cardActive;
}

constructor(private http: HttpClient,
            private authService: AuthService) { }

setPickupPosition (lat: number, lng: number) {
  this._pickupLocation = new Positions (lat, lng);
}

set pickupAddress(addy: string) {
  this._pickupAddress = addy;
}

get pickupPosition() {
  return this._pickupLocation;
}
getPickupAddress() {
  return this._pickupAddress;
}

set pickupCity(city: string) {
  this._pickupCity = city;
}

get pickupCity() {
  return this._pickupCity;
}

set deliveryCity(city: string) {
  this._deliveryCity = city;
}

get deliveryCity() {
  return this._deliveryCity;
}


confirmCityWeOperateIn(city: string) {
  return {...this.cities.find(ct => ct.cityName === city)};
}

setDeliveryPosition (lat: number, lng: number) {
  this._deliveryLocation = new Positions(lat, lng);
}

set deliveryAddress(addy: string) {
  this._pickupAddress = addy;
}

get deliveryPosition() {
  return this._deliveryLocation;
}
getDeliveryAddress() {
  return this._pickupAddress;
}


loadCityServices(from: boolean, to: boolean) {
  console.log('FROM: ' + from + ', TO: ' + to);

  if (from && to) {
  this.cityServices = [{serviceName: 'Door pickup and delivery service at both cities', serviceCode: 'doorToDoor' }, 
                         {serviceName: 'Door delivery service at destination city only', serviceCode: 'destinationOnly'},
                         {serviceName: 'Door pickup service at originating city only', serviceCode: 'pickupOnly'},
                         {serviceName: 'Interstate service only', serviceCode: 'interstateOnly'}];
  }
  else if (from && !to) {
    this.cityServices = [{serviceName: 'Door pickup service at originating city only', serviceCode: 'pickupOnly'},
                         {serviceName: 'Interstate service only', serviceCode: 'interstateOnly'}];
  }
  else if (!from && to) {
    this.cityServices = [{serviceName: 'Door delivery service at destination city only', serviceCode: 'destinationOnly'},
                         {serviceName: 'Interstate service only', serviceCode: 'interstateOnly'}];
  }
  else if (!from && !to) {
    this.cityServices = [{serviceName: 'Interstate service only', serviceCode: 'interstateOnly'}];
  }

  return [...this.cityServices];
}

setInterStateProperties(serviceOption: string, cityFrom: string, cityTo: string) {
  this._interstate_ServiceOption = serviceOption;
  this._interstate_CityFrom = cityFrom;
  this._interstate_CityTo = cityTo;
}
getCountries() {
  return [...this.countries];
}

get interstateServiceOption() {
  return this._interstate_ServiceOption;
}

get interstateCityFrom() {
  return this._interstate_CityFrom;
}

get interstateCityTo() {
  return this._interstate_CityTo;
}

get logisticsType() {
    return this._logisticsType
  }

setLogisticsType(log: string) {
    this._logisticsType = log;
  }

get selectedCountry() {
    return this._selectedCountry;
  }

  getOneCountry() {
    return {...this.countries.find(cr => cr.countryCode === this.selectedCountry)};
  }

setCountry(country: string) {
    this._selectedCountry = country;
  }

get boundaryLat () {
    return this._boundaryLat;
  }

get boundaryLng () {
    return this._boundaryLng;
  }

async cityOption() {
    let geocoder = await new google.maps.Geocoder();
    await geocoder.geocode({ address: this._cityOption }, (results, status) => {
        if (status == 'OK') {
          this._boundaryLat = results[0].geometry.location.lat();
          this._boundaryLng = results[0].geometry.location.lng();
        }
      })
  }

setCityOption(city: string) {
    this._cityOption = city;
  }

getCities() {
    return [...this.cities];
  }

getCity(city: string) {
    return {...this.cities.find(fr => fr.cityName === city)};
  }

getVehicleOption() {
    return this.vehicleOption;
  }

setVehicleOption(option: string) {
    this.vehicleOption = option;
  }

get fullVehicleCapacity() {
    return this._fullVehicleCapacity;
  }

setVehicleCapacity(vc: boolean) {
    this._fullVehicleCapacity = vc;
  }

getAccompanyOption() {
    return this.accompanyOption;
  }

setAccompanyOption(aO: string) {
    this.accompanyOption = aO;
  }

getAllServices() {
    // return this.serviceTypes.asObservable();
    return [...this.serviceTypes];
  }

getAllVehicles() {    
    return [...this.vehicleTypes];
  }

  getAllVehicles_withoutBike(){
    // this.vehicleTypesCopy = this.vehicleTypes;
    const vehicleTypesCopy2 = this.vehicleTypes.filter(item => item.vehicleType !== 'Bike');
    return [...vehicleTypesCopy2]; 
  }


  getOneVehicle(vehicle: string){
    // return  this.vehicleTypes.filter(item => item.vehicleType === vehicle);
    return {...this.vehicleTypes.find(vT => vT.vehicleType === vehicle)};
  }


   // Get mini Request
getMiniRequest() {
    return this.miniRequest;
  }

  // Keep Description
keepDescription(item: string, pickupContact: string,
                  pickupMobile: string, pickupEmail: string, deliveryContact: string,
                  deliveryMobile: string, deliveryEmail: string, amount: number) {
                    this.itemDescription = new ItemDescription(item,
                      pickupContact,
                      pickupMobile,
                      pickupEmail,
                      deliveryContact,
                      deliveryMobile,
                      deliveryEmail,
                      amount);

  }

  // Get Description
getDescription() {
    return this.itemDescription;
  }
  // Get a quote
getQuote(
    weight: number,
    worth: number,
    pickupAddress: string,
    deliveryAddress: string,
    serviceOption: string,
    pickupTime: Date,
    deliveryTime: Date,
    pickupLat: number,
    pickupLng: number,
    deliveryLat: number,
    deliveryLng: number) {

    if (!weight && !this.fullVehicleCapacity) {
      return 'incomplete records';
    }
    this.miniRequest = new MiniRequest(
      pickupAddress,
      deliveryAddress,
      weight,
      worth,
      serviceOption,
      pickupTime,
      deliveryTime,
      pickupLat,
      pickupLng,
      deliveryLat,
      deliveryLng,
      this.vehicleOption,
      this.fullVehicleCapacity,
      this.accompanyOption);
    // Get a quote form the server
    // this.http.get();
    console.log('Worth:' + worth);
    this.estimate = worth;
    return this.estimate;
  }



fetchEstimate() {
    console.log('Est.' + this.estimate);
    return this.estimate;
  }
  // Get all my requests
getRequests() {
  return [...this.fullRequest];
} 

// Get one Request
getRequest(ref: string) {
  return {...this.fullRequest.find(fr => fr.pickupRef === ref)};
}
  // Submit a request
submitRequest(
  logisticsType: string,
  interstateServiceOption: string,
  interstateCityFrom: string,
  interstateCityTo: string,
  fullVehicleCapacity: boolean,
  pickupAddress: string,
  deliveryAddress: string,
  weight: number,
  worth: number,
  serviceOption: string,
  pickupTime: Date,
  deliveryTime: Date,
  pickupLat: number,
  pickupLng: number,
  deliveryLat: number,
  deliveryLng: number,
  itemDescription: string,
  pickupContactPerson: string,
  pickupContactMobile: string,
  pickupContactEmail: string,
  deliveryContactPerson: string,
  deliveryContactMobile: string,
  deliveryContactEmail: string,
  amount: number,
  pickupRef: string,
  pickupPaymentStatus: string,
  pickupProcessStatus: string,
  userId: string,
  vehicleOption: string,
  accompanyOption: string
  
) {
  // call or submit to the server
  pickupRef = '0112202'; //new Date().toLocaleDateString();
  let pickupEntryTime = new Date();
  const newRequest = new FullRequest(
                                    logisticsType, interstateServiceOption, interstateCityFrom,
                                    interstateCityTo, fullVehicleCapacity, pickupAddress,
                                    deliveryAddress, weight, worth, serviceOption, pickupTime, 
                                    deliveryTime, pickupLat, pickupLng, deliveryLat, deliveryLng, 
                                    itemDescription, pickupContactPerson, pickupContactMobile, 
                                    pickupContactEmail, deliveryContactPerson, deliveryContactMobile, 
                                    deliveryContactEmail, amount, pickupRef, pickupPaymentStatus, 
                                    pickupProcessStatus, pickupEntryTime, userId, vehicleOption, accompanyOption);
  console.log(newRequest);
  this.fullRequest.push(newRequest);
}
  // Get List of services

  
callPaystack() {
    const headers: HttpHeaders = new HttpHeaders(
      {'x-api-key': 'KyQAyysttL7XSxs6HABj48rdHPygf8r26L9aMSWz'}
      // {'x-api-key': 'KyQAyysttL7XSxs6HABj48rdHPygf8r26L9aMSWz', 'Content-Type': 'application/json'}
    );

    // headers.append('Content-Type', 'application/json');
    // headers.append('x-api-key', 'd41d8cd98f00b204e9800998ecf8427e');
    return this.http.get<AllServiceRes>('https://1wvdgthgmc.execute-api.us-east-2.amazonaws.com/dev/getService',
    { headers });

    // return this.http.post('http://localhost:7000/feed/callPaystack',
    // {reference: '7PVGX8MEk85tgeEpVDtD_008', amount: 5000, email: 'anthosey@gmail.com'});

  }

  // For Routes that need Authorization
  testBackend() {
    const token = this.authService.token;
    if (!token ){
      console.log('no token found!'); 
      return;
    }
      else {
        console.log('token: ' + token);
        let myInit = {
           headers: { Authorization: `Bearer ${token}`}
         }
        return this.http.get<AllItemRes>('https://1wvdgthgmc.execute-api.us-east-2.amazonaws.com/dev/getItem/2', myInit);
      
      }
    
  }

// for routers tha do not need authentication to serve  
fetchServices() {
  const services = [];
  // get Service types from tha backend
  // return this.http.get<AllServiceRes>('http://localhost:3000/getService')
  return this.http.get<AllServiceRes>('https://1wvdgthgmc.execute-api.us-east-2.amazonaws.com/dev/getService')
  .pipe(map(resData => {
    for (const dat in resData.data) {
      
      // console.log(resData.data[dat].);
      services.push(new ServiceTypes(resData.data[dat].service_type,  +resData.data[dat].price));
      // console.log(serviceType.price);
      // this.serviceTypes.push(serviceType);
    }
  return services;
  }));

  
  // return [...this.serviceTypes];
}

}
