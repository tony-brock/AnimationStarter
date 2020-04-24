//get the mean grades 
var getMeanGrade = function(entries)
{
    return d3.mean(entries,function(entry)
        {
            return entry.grade;
        })
}

 //draw the scatter plot (update)
var drawScatter = function(students,target,
              xScale,yScale,xProp,yProp)
{
    // sets the banner title and makes it upper case
    setBanner(xProp.toUpperCase() +" vs "+ yProp.toUpperCase());
    
    //creates the points 
    d3.select(target).select(".graph")
    .selectAll("circle")
    .data(students)
    .enter()
    .append("circle")
    .attr("cx",function(student)
    {
        return xScale(getMeanGrade(student[xProp]));    
    })
    .attr("cy",function(student)
    {
        return yScale(getMeanGrade(student[yProp]));    
    })
    .attr("r",4);
};
// gets rid of the points 
var clearScatter = function(target)
{
    d3.select(target)
        .select(".graph")
        .selectAll("circle")
        .remove();
};
//have to update graph
var updateGraph = function(target, students, margins, screen, graph)
{
    console.log("Updating Graph")
        var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width]);
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0]);
    
    updateAxes(target,xScale,yScale);
    //JOIN
    var circles = d3.select(target)
                .select(".graph")
                .selectAll("circle")
                .data(students)
    //ENTER
    circles.enter()
            .append("circle")
    //EXIT
    circles.exit()
            .remove()
    //UPDATE
    d3.select(target)
        .select(".graph")
        .selectAll("cirlce")
        .transition()
        .attr("cx", function(student)
             {
                return xScale(getMeanGrade(student[xProp]));
            })
        .attr("cy",function(student)
              {
                return yScale(getMeanGrade(student[yProp]));   
            })
    .attr("r",4);
  
}

// creates the axes based on the size of the screen and the scales of the graph.
var createAxes= function(screen,margins,graph,
                           target,xScale,yScale)
{
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    var axes = d3.select(target)
        .append("g")
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .call(xAxis)
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top)+")")
        .call(yAxis)
}

var initAxes= function(screen,margins, graph, target, xScale, yScale)
{
    var axes= d3.select(target)
            .append("g")
            .classed("class", "axis");
    
    axes.append("g")
        .attr("transform","translate("+margins.left+","
             +(margins.top+graph.height)+")")
        .attr("id", "xAxis")
    
    
    axes.append("g")
        .attr("id","yAxis")
        .attr("transform","translate("+margins.left+","+(margins.top)+")")
}; 

var updateAxes= function(target,xScale, yScale)
{
    var xAxis= d3.axisBottom(xScale);
    var yAxis= d3.axisLeft(yScale); 
    
    d3.select("#xAxis")
        .transition()
        .call(xAxis)
    
    d3.select("#yAxis")
        .transition()
        .call(yAxis)
}
//  sets the size of the graph 
var initGraph = function(target,students)
{
    //the size of the screen
    var screen = {width:500, height:400};
    
    //how much space will be on each side of the graph
    var margins = {top:15,bottom:40,left:70,right:15};
    
    //generated how much space the graph will take up (update)
    var graph  = 
    {
        width:screen.width-margins.left-margins.right,
        height:screen.height-margins.top-margins.bottom,
    }
    

    //set the screen size
    d3.select(target)
        .attr("width",screen.width)
        .attr("height",screen.height)
    
    //create a group for the graph
    var g = d3.select(target)
        .append("g")
        .classed("graph",true)
        .attr("transform","translate("+margins.left+","+
             margins.top+")");
        
    //create scales for all of the dimensions
    
    //Extra 
    var xScale = d3.scaleLinear()
        .domain([0,100])
        .range([0,graph.width])
           
    var yScale = d3.scaleLinear()
        .domain([0,100])
        .range([graph.height,0])
  
    
    //calls the other functions to create the points, axes, and the title. 
    initAxes(screen,margins,graph,target,xScale,yScale);
    updateAxes(target, xScale, yScale);
    
    initButtons(students,target,xScale,yScale);
    
    setBanner("Click buttons to graphs");
};
  
// creates the buttons for the different data for the different graphs.
var initButtons = function(students,target,xScale,yScale)
{
    // button to create final vs HW plot
    d3.select("#fvh")
    .on("click",function()
    {
        updateGraph(students,target,screen,xScale,yScale,"final","homework");
    })
    //button to create Hw vs test
    d3.select("#hvq")
    .on("click",function()
    {
        
        drawScatter(students,target,
              xScale,yScale,"homework","test");
    })
    // button to create test vs final
    d3.select("#tvf")
    .on("click",function()
    {
        
        drawScatter(students,target,
              xScale,yScale,"test","final");
    })
    // button to create test vs quiz
    d3.select("#tvq")
    .on("click",function()
    {
      
        drawScatter(students,target,
              xScale,yScale,"test","quizes");
    });
    
    
    
}

// set the banner and its message 
var setBanner = function(msg)
{
    d3.select("#banner")
        .text(msg);
    
}


// loads in data
var penguinPromise = d3.json("/classData.json");

penguinPromise.then(function(penguins)
{
    console.log("class data",penguins);
   initGraph("#scatter",penguins);
   
},
function(err)
{
   console.log("Error Loading data:",err);
});