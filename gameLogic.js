
module.exports ={

    // Explanation on orientation of the board with the 2D array
    // The board is implemented using a 2D array. The individual arrays themselves each represent
    // a column of the connect 4 board. The columns/arrays represent the board right to left, meaning that the first array (in the 2D array)
    // represents the last column of the board. Each element within the columns take up a row and the elements themselves represent the board from 
    // top to bottom, meaning that the first element in the individual array/column represents the element at the top of the board

    createBoard : function(width, height) { // Width = 7, height = 6 for the board we will use
        board = []; // Each entry in the board will be a column
        for (let i = 0; i < width; i++) { // Width
            row = [];
            for (let j = 0; j < height; j++){
                row.push('x'); // Empty slots will be marked as 'x'
            }
            board.push(row);
        }

        console.log(board)
        return board;
    },

    insertPiece : function(board, player, column) { // Player is marked with either 1 or 2 and column ranges from 0 to 6
        piecePlaced = false;
        for (let i = board[column].length-1; i >= 0; i--) { // Start from the end of the column (bottom of board)
            if (board[column][i] === 'x') { // Check if the slot is empty
                board[column][i] = player
                piecePlaced = true;
                break;
            }   
        }
        return piecePlaced;
    },

    checkWin : function(board) {

        boardWidth = board.length
        boardHeight = board[0].length 

        // Status:
        // -1 - No conclusive decision made
        // 0 - Draw
        // 1 - Player 1 win
        // 2 - Player 2 win
        status = -1;
        
        // Horizontal Check

        for(let i = 0; i < boardHeight; i++) { // Check each row starting from bottom to top
            let current = 'x';
            let count = 0;
            for (let j = 0; j < boardWidth; j++) { // Check each column on the same row starting from left to right
                if (board[j][i] === current && !(current === 'x' )) {
                    count++; // Increment the count 
                } else { // Reset the count 
                    count = 1;
                    current = board[j][i];
                }  

                if (count === 4) { // Win detected
                    status = Number(current)
                    return status;
                }; 
            }

        }

        // Vertical Check
        for (let i = 0; i < boardWidth; i++) { // Check each column of the board
            let current = 'x';
            let count = 0;
            for (let j = 0; j < boardHeight; j++) { // Check each column starting from top to bottom
                if (board[i][j] === current && !(current === 'x' )) {
                    count++; // Increment the count 
                } else { // Reset the count 
                    count = 1;
                    current = board[i][j];
                }  

                if (count === 4) { // Win detected
                    status = Number(current)
                    return status;
                }; 
            }
        }

        // Ascending Diagonal Check
        // Going along 1st half
        for(let i = 0; i <= boardWidth - 4; i++) { // Column by column, starting from the left
            
            let current = 'x';
            let count = 0;
            
            for(let row = i, col = 0; row < boardWidth && col < boardHeight; row++, col++) {

                if (board[row][col] === current && !(current === 'x' )) {
                    count++
                } else {
                    count = 1;
                    current = board[row][col];
                }

                if (count === 4) { // Win detected
                    status = Number(current)
                    return status;
                }; 
            }

        }

        // Going along 2nd half
        for(let i = boardWidth-1; i >= boardWidth - 4; i--) {
            let current = 'x';
            let count = 0;
            for(let row = i, col = boardHeight - 1; row >= 0 && col >= 0; row--, col--) {

                if (board[row][col] === current && !(current === 'x' )) {
                    count++
                } else {
                    count = 1;
                    current = board[row][col];
                }

                if (count === 4) { // Win detected
                    status = Number(current)
                    return status;
                }; 
            }
        }

        // Desending Diagonal Check
        // Going along 1st half
        for(let i = 0; i <= boardWidth - 4; i++) { // Column by column, starting from the left
            
            let current = 'x';
            let count = 0;
            
            for(let row = i, col = boardHeight-1; row < boardWidth && col >= 0; row++, col--) {

                if (board[row][col] === current && !(current === 'x' )) {
                    count++
                } else {
                    count = 1;
                    current = board[row][col];
                }

                if (count === 4) { // Win detected
                    status = Number(current)
                    return status;
                }; 
            }

        }

        // Going along 2nd half
        for(let i = boardWidth-1; i >= boardWidth - 4; i--) {
            let current = 'x';
            let count = 0;
            for(let row = i, col = 0; row >= 0 && col < boardHeight; row--, col++) {

                if (board[row][col] === current && !(current === 'x' )) {
                    count++
                } else {
                    count = 1;
                    current = board[row][col];
                }

                if (count === 4) { // Win detected
                    status = Number(current)
                    return status;
                }; 
            }
        }



        // Check if the board is full
        boardFull = true;
        for (let i = 0; i < boardWidth; i++) {
            if (board[i].includes('x')) { // Empty slot exists
                boardFull = false;
                break;
            }
        }


        if (!boardFull) {
            return -1; // Inconclusive
        } else {
            return 0; // Draw since board is full
        } 
        
    }


}

