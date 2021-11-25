// https://lancaster-university.github.io/microbit-docs/resources/bluetooth/bluetooth_profile.html
// An implementation of Nordic Semicondutor's UART/Serial Port Emulation over Bluetooth low energy
const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

// Allows the micro:bit to transmit a byte array
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

// Allows a connected client to send a byte array
const UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let uBitDevice;
let rxCharacteristic;

function setup() {
  const connectButton = createButton("Connect");
  connectButton.mousePressed(connectButtonPressed);

  const disconnectButton = createButton("Disconnect");
  disconnectButton.mousePressed(disconnectButtonPressed);

  const pingButton = createButton("Ping");
  pingButton.mousePressed(pingButtonPressed);
}

function draw() {
  background(0);
}

async function connectButtonPressed() {
  try {
    console.log("Requesting Bluetooth Device...");
    uBitDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "Adafruit Bluefruit LE"}],
      optionalServices: [UART_SERVICE_UUID]
    });

    console.log("Connecting to GATT Server...");
    const server = await uBitDevice.gatt.connect();

    console.log("Getting Service...");
    const service = await server.getPrimaryService(UART_SERVICE_UUID);

    //console.log("Getting Characteristics...");
   // const txCharacteristic = await service.getCharacteristic(
    //  UART_TX_CHARACTERISTIC_UUID
    //);
    
    //txCharacteristic.startNotifications();
    //console.log("here1!");
   // txCharacteristic.addEventListener(
    //  "characteristicvaluechanged",
    //  onTxCharacteristicValueChanged
   /// );

    rxCharacteristic =  service.getCharacteristic(
      UART_RX_CHARACTERISTIC_UUID
    ).then((characteristic)=>{
        
        const svg = d3.select("body").append("svg").attr('width',1000).attr("height", 600);
           

        let data = [];
       
        return characteristic.startNotifications()
        .then(char => {
          characteristic.addEventListener('characteristicvaluechanged',
                (event)=>{
                    
                    const ts = Date.now();
                    const dv = event.target.value;
                    const arr = new Uint8Array(dv.buffer)
                    const strnum = arr.reduce((acc,item)=>{
                        return `${acc}${item-48}`;
                    },"");
                    
                  

                    data.push({ts, value: Number(strnum)});
                  
                    
                    if (data.length > 40){
                        [item, ...data] = data;
                    }

                    console.log(data);

                    const chart = svg.selectAll("rect").data(data, d=>d.value)  
                    
                    chart.enter()  // Returns placeholders for our missing elements
                    .append("rect")  // Creates the new rectangles
                    .attr("x", (d, i)=> i * 21)
                    .attr("y", (d, i)=> d.value <= 0 ? 600 - 1023/3 : 600 - (d.value/3))
                    .attr("rx",4)
                    .attr("ry",4)
                    .attr("width", 20)
                    .attr("height", (d)=> d.value > 0 ? d.value/3 : 1023/3)
                    .style("fill", d=> d.value > 0 ? "orange": "steelblue")
                    .style("opacity", d=> d.value <= 0 ? 0.1 : 1)

                    chart.attr("x", (d, i)=> i * 21)
                    //transition()
                    //.duration(100) // Creates the new rectangles
                    
                    

                    chart.exit().remove()

                   
            });
        });

       
    
    }),

  
    //rxCharacteristic.addEventListener("characteristicvaluechanged", onTxCharacteristicValueChanged);
    console.log(rxCharacteristic);
    //console.log("here3!");
  } catch (error) {
    console.log(error);
  }
}

function disconnectButtonPressed() {
  if (!uBitDevice) {
    return;
  }

  if (uBitDevice.gatt.connected) {
    uBitDevice.gatt.disconnect();
    console.log("Disconnected");
  }
}

async function pingButtonPressed() {
  if (!rxCharacteristic) {
    return;
  }

  try {
    let encoder = new TextEncoder();
    rxCharacteristic.writeValue(encoder.encode("P\n"));
  } catch (error) {
    console.log(error);
  }
}
