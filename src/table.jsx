import "./table.css";
import React, { useEffect, useState } from "react";
import cloneDeep from "lodash/cloneDeep";

const rowMap = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };
const colMap = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 6 };
const COPY_PATERN = { ROW: "ROW", COL: "COL", BOTH: "BOTH" };
const Table = () => {
    const [selectCell, setSelectCell] = useState({});
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [selectRow, setSelectRow] = useState({});
    const [selectColumn, setSelectColumn] = useState({});
    const [copyCell, setCopyCell] = useState("");

    const [minCol, setMinCol] = useState();
    const [maxCol, setMaxCol] = useState();
    const [minRow, setMinRow] = useState();
    const [maxRow, setMaxRow] = useState();
    const [isDrag, setIsDrag] = useState(false);
    const [copyPatern, setCopyPatern] = useState("");
    const [editCell, setEditCell] = useState("");
    const [clicks, setClicks] = useState(0);
    const delay = 400;
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
        4: {
            A: 0.4111,
            B: 0.4222,
            C: 0.4333,
            D: 0.4444,
            E: 0.4555,
            F: 0.4666,
        },
        5: {
            A: 0.5111,
            B: 0.5222,
            C: 0.5333,
            D: 0.5444,
            E: 0.5555,
            F: 0.5666,
        },
    });

    const [selectStack, setSelectStack] = useState([]);

    useEffect(() => {
        if (!editCell) {
            document.addEventListener("mouseup", mouseUp);
            return () => {
                document.removeEventListener("mouseup", mouseUp);
            };
        }
    });

    useEffect(() => {
        document.addEventListener("keydown", handleButtonPress);
        return () => {
            document.removeEventListener("keydown", handleButtonPress);
        };
    });

    const getKeyByValue = (object, value) => {
        return Object.keys(object).find((key) => object[key] == value);
    };

    const mouseDown = (event, row, col) => {
        event.preventDefault();
        let c = clicks;
        c++;
        setClicks(c);

        setTimeout(function () {
            setClicks(0);
        }, delay);

        if (c === 2) {
            // double click event handler should be here
            handleDoubleClick(col, row);
            setClicks(0);
            return;
        }

        setSelectCell({ [row + col]: true });

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
        setEditCell("");
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
        if (isDrag) {
            if (
                rowMap[row] > rowMap[copyCell.maxRow] &&
                colMap[col] > colMap[copyCell.maxCol]
            ) {
                return;
            }
            if (
                copyPatern == COPY_PATERN.COL &&
                rowMap[row] < rowMap[copyCell.maxRow]
            ) {
                return;
            } else if (
                copyPatern == COPY_PATERN.ROW &&
                colMap[col] < colMap[copyCell.maxCol]
            ) {
                return;
            }
        }
        if (isMouseDown || isDrag) {
            setMaxCol(col);
            setMaxRow(row);
        }
    };

    const mouseUp = () => {
        setIsMouseDown(false);
        setSelectColumn({});
        setSelectRow({});
        if (isDrag) {
            dragAndPasteHanler();
        }
        setIsDrag(false);
    };

    const handleButtonPress = (event) => {
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
        }
    };
    const handlePaste = () => {
        const cloneData = cloneDeep(data);
        const buData = cloneDeep(data);
        const newData = {};
        let iOffset = rowMap[copyCell.minRow];
        let jOffset = colMap[copyCell.minCol];
        const maxI = Object.keys(data).length;
        const maxJ = Object.keys(data[1]).length;
        for (
            let i = rowMap[minRow];
            i <=
            rowMap[copyCell.maxRow] - rowMap[copyCell.minRow] + rowMap[minRow];
            i++
        ) {
            if (i > maxI) {
                break;
            }
            for (
                let j = colMap[minCol];
                j <=
                colMap[copyCell.maxCol] -
                    colMap[copyCell.minCol] +
                    colMap[minCol];
                j++
            ) {
                if (j > maxJ) {
                    break;
                }
                if (!(getKeyByValue(rowMap, i) in newData)) {
                    newData[getKeyByValue(rowMap, i)] = cloneDeep(
                        buData[getKeyByValue(rowMap, i)]
                    );
                }
                newData[getKeyByValue(rowMap, i)][getKeyByValue(colMap, j)] =
                    buData[getKeyByValue(rowMap, iOffset)][
                        getKeyByValue(colMap, jOffset)
                    ];

                jOffset++;
                //
            }
            jOffset = colMap[copyCell.minCol];
            iOffset++;
        }

        setData({ ...cloneData, ...newData });
        setCopyCell("");
    };

    const dragStart = (e) => {
        e.stopPropagation();
        if (rowMap[maxRow] - rowMap[minRow] > colMap[maxCol] - colMap[minCol]) {
            setCopyPatern(COPY_PATERN.COL);
        } else if (
            rowMap[maxRow] - rowMap[minRow] <
            colMap[maxCol] - colMap[minCol]
        ) {
            setCopyPatern(COPY_PATERN.ROW);
        } else {
            setCopyPatern(COPY_PATERN.BOTH);
        }
        handleCopy();
        setIsDrag(true);
    };

    const dragAndPasteHanler = () => {
        const cloneData = cloneDeep(data);
        let startCol;
        let startRow;

        let iOffset = rowMap[copyCell.minRow];
        let jOffset = colMap[copyCell.minCol];
        const newData = {};
        if (copyCell.maxRow == maxRow) {
            startCol = colMap[copyCell.maxCol] + 1;
            startRow = rowMap[copyCell.minRow];
        } else if (copyCell.maxCol == maxCol) {
            startCol = colMap[copyCell.minCol];
            startRow = rowMap[copyCell.maxRow] + 1;
        }

        for (let i = startRow; i <= rowMap[maxRow]; i++) {
            for (let j = startCol; j <= colMap[maxCol]; j++) {
                if (!(getKeyByValue(rowMap, i) in newData)) {
                    newData[getKeyByValue(rowMap, i)] =
                        cloneData[getKeyByValue(rowMap, i)];
                }
                newData[getKeyByValue(rowMap, i)][getKeyByValue(colMap, j)] =
                    cloneData[getKeyByValue(rowMap, iOffset)][
                        getKeyByValue(colMap, jOffset)
                    ];
                jOffset++;
            }
            jOffset = colMap[copyCell.minCol];
            iOffset++;
        }
        setData({ ...cloneData, ...newData });
        setCopyCell("");
    };

    const getMarkBorderStyle = (col, row) => {
        let border = "2px solid gray";

        const style = {};
        if (
            rowMap[minRow] == rowMap[row] &&
            colMap[col] >= colMap[minCol] &&
            colMap[col] <= colMap[maxCol]
        ) {
            style["borderTop"] = border;
        }
        if (
            rowMap[maxRow] == rowMap[row] &&
            colMap[col] >= colMap[minCol] &&
            colMap[col] <= colMap[maxCol]
        ) {
            style["borderBottom"] = border;
        }
        if (
            colMap[minCol] == colMap[col] &&
            rowMap[row] >= rowMap[minRow] &&
            rowMap[row] <= rowMap[maxRow]
        ) {
            style["borderLeft"] = border;
        }
        if (
            colMap[maxCol] == colMap[col] &&
            rowMap[row] >= rowMap[minRow] &&
            rowMap[row] <= rowMap[maxRow]
        ) {
            style["borderRight"] = border;
        }
        return style;
    };

    const getCopyBorderStyle = (col, row) => {
        let border = "2px dashed deepskyblue";

        const style = {};
        if (
            rowMap[copyCell.minRow] == rowMap[row] &&
            colMap[col] >= colMap[copyCell.minCol] &&
            colMap[col] <= colMap[copyCell.maxCol]
        ) {
            style["borderTop"] = border;
        }
        if (
            rowMap[copyCell.maxRow] == rowMap[row] &&
            colMap[col] >= colMap[copyCell.minCol] &&
            colMap[col] <= colMap[copyCell.maxCol]
        ) {
            style["borderBottom"] = border;
        }
        if (
            colMap[copyCell.minCol] == colMap[col] &&
            rowMap[row] >= rowMap[copyCell.minRow] &&
            rowMap[row] <= rowMap[copyCell.maxRow]
        ) {
            style["borderLeft"] = border;
        }
        if (
            colMap[copyCell.maxCol] == colMap[col] &&
            rowMap[row] >= rowMap[copyCell.minRow] &&
            rowMap[row] <= rowMap[copyCell.maxRow]
        ) {
            style["borderRight"] = border;
        }
        return style;
    };

    const handleDoubleClick = (col, row) => {
        setEditCell(row + col);
    };

    const valueChangeHandler = (e, row, col) => {
        let val = e.target.value;

        const cloneData = cloneDeep(data);

        const newData = {};
        newData[row] = cloneData[row];
        newData[row][col] = val;

        setData({ ...cloneData, ...newData });
    };
    const CustomCell = ({ row, col }) => {
        return (
            <React.Fragment>
                <td
                    className={
                        selectCell[row + col] ? "td_selected" : undefined
                    }
                    style={{
                        ...getMarkBorderStyle(col, row),
                        ...getCopyBorderStyle(col, row),
                    }}
                    onMouseDown={(e) => mouseDown(e, row, col)}
                    onMouseEnter={() => mouseOver(row, col)}
                >
                    {data[row][col]}
                    {selectCell[row + col] && row + col == maxRow + maxCol && (
                        <div
                            className='td_corner'
                            onMouseDown={dragStart}
                            //onClick={(e) => e.stopPropagation()}
                        ></div>
                    )}
                </td>
            </React.Fragment>
        );
    };

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
                            {Object.keys(data[row]).map((col, index) => {
                                if (editCell == row + col) {
                                    return (
                                        <td key={index}>
                                            <input
                                                className='input'
                                                value={data[row][col]}
                                                onChange={(e) =>
                                                    valueChangeHandler(
                                                        e,
                                                        row,
                                                        col
                                                    )
                                                }
                                                autoFocus
                                            />
                                        </td>
                                    );
                                } else {
                                    return (
                                        <CustomCell
                                            key={index}
                                            row={row}
                                            col={col}
                                        />
                                    );
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
