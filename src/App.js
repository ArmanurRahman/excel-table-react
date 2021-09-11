import "./App.css";
import React, { useEffect, useState } from "react";

const rowMap = { 1: 1, 2: 2, 3: 3 };
const colMap = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };
function App() {
    const [selectCell, setSelectCell] = useState({});
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectRow, setSelectRow] = useState({});
    const [selectColumn, setSelectColumn] = useState({});
    const [copyCell, setCopyCell] = useState("");
    const [currentCell, setCurrentCell] = useState("");
    const [nextCell, setNesXtCell] = useState("");
    const [minCol, setMinCol] = useState();
    const [maxCol, setMaxCol] = useState();
    const [minRow, setMinRow] = useState();
    const [maxRow, setMaxRow] = useState();
    const [data, setData] = useState({
        1: {
            A: 0.0001,
            B: 0.0002,
            C: 0.0003,
            D: 0.0004,
            E: 0.0005,
            F: 0.0006,
        },
        2: {
            A: 0.0011,
            B: 0.2112,
            C: 0.0013,
            D: 0.0014,
            E: 0.0015,
            F: 0.0016,
        },
        3: {
            A: 0.0111,
            B: 0.0222,
            C: 0.0333,
            D: 0.0444,
            E: 0.0555,
            F: 0.0666,
        },
    });

    const [selectStack, setSelectStack] = useState([]);

    useEffect(() => {
        document.addEventListener("mouseup", mouseUp);
        return () => {
            document.removeEventListener("mouseup", mouseUp);
        };
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", handleButtonPress);
        return () => {
            document.removeEventListener("keydown", handleButtonPress);
        };
    });

    const getKeyByValue = (object, value) => {
        return Object.keys(object).find((key) => object[key] == value);
    };

    const mouseDown = (row, col) => {
        setSelectCell({ [row + col]: true });
        //console.log(" mouse down ", row, col);
        setIsMouseDown(true);

        const slt = [...selectStack];
        const currentSelectRow = { ...selectRow };
        const currentSelectColumn = { ...selectColumn };
        currentSelectRow[row] = true;
        currentSelectColumn[col] = true;

        setMinCol(col);
        setMaxCol(col);
        setMinRow(row);
        setMaxRow(row);

        setSelectRow(currentSelectRow);
        setSelectColumn(currentSelectColumn);

        slt.push(row + col);
        setSelectStack(slt);
    };

    useEffect(() => {
        let select = {};
        for (let i = rowMap[minRow]; i <= rowMap[maxRow]; i++) {
            for (let j = colMap[minCol]; j <= colMap[maxCol]; j++) {
                select[
                    getKeyByValue(rowMap, i) + getKeyByValue(colMap, j)
                ] = true;
            }
        }
        setSelectCell(select);
    }, [minRow, maxRow, minCol, maxCol]);
    const mouseOver = (row, col) => {
        if (isMouseDown) {
            setMaxCol(col);
            setMaxRow(row);
        }
    };

    const mouseUp = () => {
        console.log(" mouse up ");
        setIsMouseDown(false);
        setSelectColumn({});
        setSelectRow({});
    };

    const handleButtonPress = (event) => {
        console.log("in");
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if (event.ctrlKey && charCode == "c") {
            handleCopy();
        } else if (event.ctrlKey && charCode == "v") {
            handlePaste();
        }
        if (event.metaKey && charCode === "c") {
            handleCopy();
        } else if (event.metaKey && charCode === "v") {
            handlePaste();
        }
    };

    const handleCopy = () => {
        if (Object.keys(selectCell).length > 0) {
            setCopyCell({
                minCol: minCol,
                maxCol: maxCol,
                minRow: minRow,
                maxRow: maxRow,
            });
            console.log("Ctrl + C pressed");
        }
    };
    const handlePaste = () => {
        const cloneData = { ...data };
        const newData = {};
        let iOffset = rowMap[copyCell.minRow];
        let jOffset = colMap[copyCell.minCol];
        for (
            let i = rowMap[minRow];
            i <=
            rowMap[copyCell.maxRow] - rowMap[copyCell.minRow] + rowMap[minRow];
            i++
        ) {
            for (
                let j = colMap[minCol];
                j <=
                colMap[copyCell.maxCol] -
                    colMap[copyCell.minCol] +
                    colMap[minCol];
                j++
            ) {
                //
                if (!(getKeyByValue(rowMap, i) in newData)) {
                    console.log("out");
                    newData[getKeyByValue(rowMap, i)] = {};
                }
                newData[getKeyByValue(rowMap, i)][getKeyByValue(colMap, j)] =
                    cloneData[getKeyByValue(rowMap, iOffset)][
                        getKeyByValue(colMap, jOffset)
                    ];
                console.log(iOffset, jOffset);
                jOffset++;
                //
            }
            jOffset = colMap[copyCell.minCol];
            iOffset++;
        }
        //console.log("Ctrl + V pressed");
        console.log(newData);
    };
    const CustomCell = ({ row, col }) => {
        return (
            <React.Fragment>
                <td
                    className={
                        selectCell[row + col] ? "td_selected" : undefined
                    }
                    //onClick={() => handleCurrentCell(row, col)}
                    onMouseDown={() => mouseDown(row, col)}
                    onMouseEnter={() => mouseOver(row, col)}
                    //onMouseOut={() => mouseOut(row, col)}
                    //onMouseUp={() => mouseUp(row, col)}
                >
                    {data[row][col]}
                    {selectCell[row + col] && row + col == maxRow + maxCol && (
                        <div className='td_corner'></div>
                    )}
                </td>
            </React.Fragment>
        );
    };
    //console.log(isMouseDown);
    console.log(copyCell);
    return (
        <div className='App'>
            <table className='table'>
                <thead>
                    <tr>
                        <th> </th>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>D</th>
                        <th>E</th>
                        <th>F</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(data).map((row, index) => (
                        <tr key={index}>
                            <td>{row}</td>
                            <CustomCell row={row} col='A' />
                            <CustomCell row={row} col='B' />
                            <CustomCell row={row} col='C' />
                            <CustomCell row={row} col='D' />
                            <CustomCell row={row} col='E' />
                            <CustomCell row={row} col='F' />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
