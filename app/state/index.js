import { createGlobalState } from 'react-hooks-global-state';



const region = {
          latitude: 59.85843,
          longitude: 17.63356,
          latitudeDelta: 0.01,
          longitudeDelta: 0.0095,
        }  
const { setGlobalState, useGlobalState } = createGlobalState({
    currentIndex: 0,
    initialMapState: {
        markers: [], 
        region: region,
        cards: [],
    },

        
    }
    )    



fetch("https://backendnationsinn.herokuapp.com/api/nations/?ordering=id")
    .then((response) => response.json())
    .then((data) => {
        const processedData = getData(data)
        mapState = {
            markers: processedData.valueOf()[0],
            region: region,
            cards: processedData.valueOf()[1],

        }
       
        setGlobalState("initialMapState",mapState)
        
        //handledata
          
      })

      .catch((error) => {
        console.log(error);
       //handle error
      });  
function getData(customData) {
    const middleData = [];
    
    for (const key in customData) {
        for (const metaKey in customData[key]) {
            //console.log(`\n ${metaKey}`);
            middleData.push(customData[key][metaKey])
        }
    }
    //console.log(middleData)
    //The amount of lines (data points) per event in the JSON file, including the id number
    const dataPointsPerEvent = 10;

    function dataSplitter() {
        //Separates the data in middleData into one line per event.
        this.id = [];
        this.name = [];
        this.description = [];
        this.facebook = [];
        this.site = [];
        this.latitude = [];
        this.longitude = [];
        this.address = [];
        this.logo = [];
        this.marker = [];

        for (let i = 0; i < middleData.length; i += dataPointsPerEvent) {
            this.id.push(middleData[i])
            this.name.push(middleData[i + 1]);
            this.description.push(middleData[i + 2]);
            this.facebook.push(middleData[i + 3]);
            this.site.push(middleData[i + 4]);
            this.latitude.push(middleData[i + 5]);
            this.longitude.push(middleData[i + 6]);
            this.address.push(middleData[i + 7]);
            this.logo.push(middleData[i + 8]);
            this.marker.push(middleData[i + 9]);
        }
    }
    
    var splitData = new dataSplitter();
    
    //Data processing for ease of access and convenience
    function dataProcessing() {
        //Loans the data from the dataSplitter
        this.id = splitData.id;
        this.name = splitData.name;
        this.description = splitData.description;
        this.facebook = splitData.facebook;
        this.site = splitData.site;
        this.latitude = splitData.latitude;
        this.longitude = splitData.longitude;
        this.address = splitData.address;
        this.logo = splitData.logo;
        this.marker = splitData.marker;
    }

    var processedData = new dataProcessing();

    //Note that you should probably use startDate, endDate, startClock, and endClock to fetch the data you want
    //That is; unless you know what you are doing, you should not use: starttime, endtime, startYear, startMonth, startDay, startHour, startMinute, endYear, endMonth, endDay, endHour, endMinute
    const data =
    {
        id: processedData.id,
        name: processedData.name,
        description: processedData.description,
        facebook: processedData.facebook,
        site: processedData.site,
        latitude: processedData.latitude,
        longitude: processedData.longitude,
        address: processedData.address,
        logo: processedData.logo,
        marker: processedData.marker,
    };
    //console.log(data.marker)

    const markerImages = [
        { image: { uri: data.marker[0] } },
        { image: { uri: data.marker[1] } },
        { image: { uri: data.marker[2] } },
        { image: { uri: data.marker[3] } },
        { image: { uri: data.marker[4] } },
        { image: { uri: data.marker[5] } },
        { image: { uri: data.marker[6] } },
        { image: { uri: data.marker[7] } },
        { image: { uri: data.marker[8] } },
        { image: { uri: data.marker[9] } },
        { image: { uri: data.marker[10] } },
        { image: { uri: data.marker[11] } },
        { image: { uri: data.marker[12] } },
    ];

    const markers = [
        {
            coordinate: {
                latitude: parseFloat(data.latitude[0]),
                longitude: parseFloat(data.longitude[0]),
            },
            title: data.name[0],
            image: markerImages[0].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[1]),
                longitude: parseFloat(data.longitude[1]),
            },
            title: data.name[1],
            image: markerImages[1].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[2]),
                longitude: parseFloat(data.longitude[2]),
            },
            title: data.name[2],
            image: markerImages[2].image
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[3]),
                longitude: parseFloat(data.longitude[3]),
            },
            title: data.name[3],
            image: markerImages[3].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[4]),
                longitude: parseFloat(data.longitude[4]),
            },
            title: data.name[4],
            image: markerImages[4].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[5]),
                longitude: parseFloat(data.longitude[5]),
            },
            title: data.name[5],
            image: markerImages[5].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[6]),
                longitude: parseFloat(data.longitude[6]),
            },
            title: data.name[6],
            image: markerImages[6].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[7]),
                longitude: parseFloat(data.longitude[7]),
            },
            title: data.name[7],
            image: markerImages[7].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[8]),
                longitude: parseFloat(data.longitude[8]),
            },
            title: data.name[8],
            image: markerImages[8].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[9]),
                longitude: parseFloat(data.longitude[9]),
            },
            title: data.name[9],
            image: markerImages[9].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[10]),
                longitude: parseFloat(data.longitude[10]),
            },
            title: data.name[10],
            image: markerImages[10].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[11]),
                longitude: parseFloat(data.longitude[11]),
            },
            title: data.name[11],
            image: markerImages[11].image,
        },
        {
            coordinate: {
                latitude: parseFloat(data.latitude[12]),
                longitude: parseFloat(data.longitude[12]),
            },
            title: data.name[12],
            image: markerImages[12].image,
        },
    ];

    const cardImages = [
        { image: { uri: data.logo[0] } },
        { image: { uri: data.logo[1] } },
        { image: { uri: data.logo[2] } },
        { image: { uri: data.logo[3] } },
        { image: { uri: data.logo[4] } },
        { image: { uri: data.logo[5] } },
        { image: { uri: data.logo[6] } },
        { image: { uri: data.logo[7] } },
        { image: { uri: data.logo[8] } },
        { image: { uri: data.logo[9] } },
        { image: { uri: data.logo[10] } },
        { image: { uri: data.logo[11] } },
        { image: { uri: data.logo[12] } },
    ];
    
    const cards = [
        {
            title: data.name[0],
            image: cardImages[0].image,
            address: data.address[0],
            site: data.site[0],
            facebook: data.facebook[0],
        },
        {
            title: data.name[1],
            image: cardImages[1].image,
            address: data.address[1],
            site: data.site[1],
            facebook: data.facebook[1],
        },
        {
            title: data.name[2],
            image: cardImages[2].image,
            address: data.address[2],
            site: data.site[2],
            facebook: data.facebook[2],
        },
        {
            title: data.name[3],
            image: cardImages[3].image,
            address: data.address[3],
            site: data.name[3],
            facebook: data.name[3],
        },
        {
            title: data.name[4],
            image: cardImages[4].image,
            address: data.address[4],
            site: data.site[4],
            facebook: data.facebook[4],
        },
        {
            title: data.name[5],
            image: cardImages[5].image,
            address: data.address[5],
            site: data.site[5],
            facebook: data.facebook[5],
        },
        {
            title: data.name[6],
            image: cardImages[6].image,
            address: data.address[6],
            site: data.site[6],
            facebook: data.facebook[6],
        },
        {
            title: data.name[7],
            image: cardImages[7].image,
            address: data.address[7],
            site: data.site[7],
            facebook: data.facebook[7],
        },
        {
            title: data.name[8],
            image: cardImages[8].image,
            address: data.address[8],
            site: data.site[8],
            facebook: data.facebook[8],
        },
        {
            title: data.name[9],
            image: cardImages[9].image,
            address: data.address[9],
            site: data.site[9],
            facebook: data.facebook[9],
        },
        {
            title: data.name[10],
            image: cardImages[10].image,
            address: data.address[10],
            site: data.site[10],
            facebook: data.facebook[10],
        },
        {
            title: data.name[11],
            image: cardImages[11].image,
            address: data.address[11],
            site: data.site[11],
            facebook: data.facebook[11],
        },
        {
            title: data.name[12],
            image: cardImages[12].image,
            address: data.address[12],
            site: data.site[12],
            facebook: data.facebook[12],
        },
    ];
  return [markers, cards]
}




    
    

export {setGlobalState, useGlobalState}