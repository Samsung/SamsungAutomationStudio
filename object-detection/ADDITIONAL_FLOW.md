[1. Data Modeling](#Data-Modeling)  
[2. Alarm Flow](#Alarm-Flow)  
[3. Chart Flow](#Chart-Flow) 


# Object Detection Nodes

# Data Modeling

### ObjectDetection Result storage format (saved every second)

```json
{
  _id {
    $oid 63328e72995d727ec2d5171e
  },
  location Bed, 
  pose Stand,
  timestamp {
    $date {
      $numberLong 1665100800000
    }
  }
}
```

- location User's location detected by ObjectDetection
- pose User's pose detected by ObjectDetectio
- timestamp The time at which the detection result was saved in the log

### Alarm Options Save Format

```json
{
  _id {
    $oid 6332fd24995d727ec2d5485b
  },
  location Bed,
  setTime 180,
  poseData [
    Lie
  ],
  timestamp {
    $date {
      $numberLong 1664285988780
    }
  }
}
```

- location Alarm condition (location)
- setTime alarm set time(sec)
- poseData Alarm condition (pose)
- timestamp alarm start time

# Alarm Flow 


# Chart Flow



### Enter start date and end date

![Untitled (1)](httpsuser-images.githubusercontent.com67916174192566343-fbb107a9-e972-4eba-b273-0e202868238c.png)

### input data format

```json
{ label  label
, payload  data value}
```

![Untitled (2)](httpsuser-images.githubusercontent.com67916174192566492-be507666-b4e0-44b8-a075-e89350244056.png)

### Sum Chart

The values staying at the location within the period are displayed in the form of a bar chart.

### Pie Chart

The values staying at the location within the period are displayed in the form of a pie chart.

### Avg Chart

By averaging the values staying at the location within the period, the time spent at the location per day is displayed in the form of a bar chart.

![Untitled (3)](httpsuser-images.githubusercontent.com67916174192566609-9c445d51-f01e-4209-80e0-ab6544a6be7e.png)

### Day Chart

The values staying at the location within the period are divided by date and displayed in the form of a bar chart.

### Timeline Chart(Day)

The log value stored on the specified day is displayed as a timeline graph.

```json
{labels[Bed,Couch],datasets[{labelBed,timestamp2022-09-27T142926.395Z,data[[2022-11-06T180200.000Z,2022-11-06T182200.000Z,#FF6633],[2022-11-06T184200.000Z,2022-11-06T190100.000Z,#FF6633]]},{labelCouch,timestamp2022-09-27T142926.395Z,data[[2022-11-06T182200.000Z,2022-11-06T184200.000Z,#5DA5DA]]}]}
```

![Untitled (4)](httpsuser-images.githubusercontent.com67916174192567130-0d7f5690-f19c-45ce-af07-4933758e4c8c.png)

### Timeline Chart(Live)

Real-time saved log values are displayed in a timeline chart.


![Untitled (5)](httpsuser-images.githubusercontent.com67916174192567188-f7c809f1-8183-4d47-a195-412fde022725.png)
