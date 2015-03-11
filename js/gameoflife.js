// The GameOfLife function 
var GameOfLife = function(params){
  // User-set params ( read the use objects or choose the default "10"
  var num_cells_y = params["init_cells"].length,
      num_cells_x = params["init_cells"][0].length,
      cell_width  = params["cell_width"]  || 30,
      cell_height = params["cell_height"] || 30,
      init_cells  = params["init_cells"]  || [], // The users choose or null array
      canvas_id   = params["canvas_id"]   || "life", // The use chosen Id or "life"

      cell_array = [], 
      display     = new GameDisplay(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id),// Display my Array with the parameters that i choose 
      interval = null,    
	  
//------------------------------------------------------------------------------------------------------------------------------------------------------

	// I need to convert init_cells array of 0's and 1's to actual Cell objects

      init = function() {        
        var length_y = init_cells.length,// variable for the length of y dimensions (row)
            length_x, // variable for the length of x dimensions (column)
            y, x; // start variables for row and column 
        // Check each row 
        for (y = 0; y < length_y; y++) {
          length_x = init_cells[y].length; //this code will keep update the length of x until the last y in this loop.
          // For each column 
          for (x = 0; x < length_x; x++) { // Loop inside the first loop which will check each column to check it's state.
            var state = (init_cells[y][x] == 1) ? 'alive' : 'dead'; //If current cell value is number 1 then the cell is alive otherwise it's dead. Save the state in the variable state
            init_cells[y][x] = new Cell(x, y, state); //Give init_cells[y][x] a new position to check the new column at the same row  
          }
		  // the loop will go through all the columns and give it a state depending on the initial value the user has chose in example.js (0 or 1). 
        }
        cell_array = init_cells; //The Array now has new display which is (alive=1 or dead=0) [I will use the same variable late to check the current state]
        display.update(cell_array);//Update the display for the Array 
      },
	  
//-------------------------------------------------------------------------------------------------------------------------------------------------

      // Function to calculate the next generation of cells, based on the rules of the Game of Life
      nextGenCells = function() {
        //  - For each cell:
        //      - Check all of its neighbours
        //      - Based on the rules, set the next generation cell to alive or dead
        
        var current_gen = cell_array, // variable current_gen to save the current generation from cell_array variable
            next_gen = [],      // Variable as an empty Array to hold the next gen cells
            length_y = cell_array.length,  // length_y variable will save it's value from the current array length (row).  
            length_x, // Variable for the length of x dimensions (column) 
            y, x; // start variables for row and column 
        // each row
        for (y = 0; y < length_y; y++) {
          length_x = current_gen[y].length; //this code will keep update the length of x until the last y in this loop.
          next_gen[y] = []; 
          // each column in rows
          for (x = 0; x < length_x; x++) {
            var cell = current_gen[y][x]; // Variable to save the position for the chosen cell
            // Calculate above/below/left/right row/column values
            var row_above = (y-1 >= 0) ? y-1 : length_y-1; // If current cell is on first row, cell "above" is the last row (stitched)
            var row_below = (y+1 <= length_y-1) ? y+1 : 0; // If current cell is in last row, then cell "below" is the first row
            var column_left = (x-1 >= 0) ? x-1 : length_x - 1; // If current cell is on first row, then left cell is the last row
            var column_right = (x+1 <= length_x-1) ? x+1 : 0; // If current cell is on last row, then right cell is in the first row
			// check all neighbours  
            var neighbours = {
              top_left: current_gen[row_above][column_left].clone(),
              top_center: current_gen[row_above][x].clone(),
              top_right: current_gen[row_above][column_right].clone(),
              left: current_gen[y][column_left].clone(),
              right: current_gen[y][column_right].clone(),
              bottom_left: current_gen[row_below][column_left].clone(),
              bottom_center: current_gen[row_below][x].clone(),
              bottom_right: current_gen[row_below][column_right].clone()
            };

            var alive_count = 0;// variable for alive object 
            var dead_count = 0;// variable for dead object
            for (var neighbour in neighbours) { //for each neighbour in all neighbours
              if (neighbours[neighbour].getState() == "dead") {// If the neighbour is dead then add one to dead count 
                dead_count++;
              } else {
                alive_count++; // or add one to alive count 
              }
            }

            // Set new state to current state depending on game rules 
            var new_state = cell.getState();
            if (cell.getState() == "alive") {
              if (alive_count < 2 || alive_count > 3) {
                // new state: dead, over-population/ under-population
                new_state = "dead";
              } else if (alive_count === 2 || alive_count === 3) {
                // lives on to next generation
                new_state = "alive";
              }
            } else {
              if (alive_count === 3) {
                // new state: live, reproduction
                new_state = "alive";
              }
            }

            //set next generation cell with new state

            next_gen[y][x] = new Cell(x, y, new_state);
            //console.log(next_gen[y][x]);
          }
        }
        //console.log(next_gen);
        return next_gen;
      }
  ;
  
//-----------------------------------------------------------------------------
// Run initial  code 
  init();
  
  return {
    // Returns the next generation array of cells
    step: function(){
      var next_gen = nextGenCells();
      // Set next gen as current cell array
      cell_array = next_gen;
      //console.log(next_gen);
      display.update(cell_array);
    },
    // Returns the current generation array of cells
    getCurrentGenCells: function() {
      return cell_array;
    },
    // setInterval 
    setInterval: function(the_interval) {
      interval = the_interval;
    },
    getInterval: function() {
      return interval;
    }
  };
};

//--------------------------------------------------------------------------------------------------------------

// This is an object that will take care of  display features.

var GameDisplay = function(num_cells_x, num_cells_y, cell_width, cell_height, canvas_id) {
  var canvas = document.getElementById(canvas_id),
      ctx = canvas.getContext && canvas.getContext('2d'),
      width_pixels = num_cells_x * cell_width,
      height_pixels = num_cells_y * cell_height,
	  
      drawGridLines = function() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255, 0, 0, 1)";
        ctx.beginPath();
        // foreach column
        for (var i = 0; i <= num_cells_x; i++) {
          ctx.moveTo(i*cell_width, 0);
          ctx.lineTo(i*cell_width, height_pixels);
        }
        // foreach row
        for (var j = 0; j <= num_cells_y; j++) {
          ctx.moveTo(0, j*cell_height);
          ctx.lineTo(width_pixels, j*cell_height);
        }
        ctx.stroke();// Draw the path
      },
      updateCells = function(cell_array) {
        var length_y = cell_array.length,
            length_x,
            y, x;
        // each row
        for (y = 0; y < length_y; y++) {
          length_x = cell_array[y].length;
          // each column in rows
          for (x = 0; x < length_x; x++) {
            // Draw Cell on Canvas
            drawCell(cell_array[y][x]);
          }
        }
      },
      drawCell = function(cell) {
        // find start point (top left)
        var start_x = cell.getXPos() * cell_width,
            start_y = cell.getYPos() * cell_height;
        // draw rectangle from that point, to bottom right point by adding cell_height/cell_width
        if (cell.getState() == "alive") {
          //console.log("it's alive!");
          ctx.fillRect(start_x, start_y, cell_width, cell_height);
        } else {
          ctx.clearRect(start_x, start_y, cell_width, cell_height);
        }
      },
      init = function() {
        //console.log("width_pixels: " + width_pixels);
        //console.log("height_pixels: " + height_pixels);

        // Resize Canvas
        canvas.width = width_pixels;
        canvas.height = height_pixels;

      };
	  
  init();
  
  return {
    update: function(cell_array) {
      updateCells(cell_array);
    }
  };


};

var Cell = function(x_pos, y_pos, state) {
 
 return {
    x_pos: x_pos,
    y_pos: y_pos,
    state: state,
    getXPos: function() {
      return x_pos;
    },
    getYPos: function() {
      return y_pos;
    },
    getState: function() {
      return state;
    },
    setState: function(new_state) {
      state = new_state;
    },
    clone: function() {
      return new Cell(x_pos, y_pos, state);
    }
  };
};

