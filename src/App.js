import "./App.css";
import React, { useEffect, useState } from "react";

const data = {
    1: {
        A: 0.0002,
        B: 0.0004,
        C: 0.0004,
        D: 0.0004,
        E: 0.0004,
        F: 0.0004,
    },
    2: {
        A: 0.0009,
        B: 0.2154,
        C: 0.0004,
        D: 0.0004,
        E: 0.0004,
        F: 0.0004,
    },
    3: {
        A: 0.0002,
        B: 0.0004,
        C: 0.0004,
        D: 0.0004,
        E: 0.0004,
        F: 0.0004,
    },
};
function App() {
    const [selectCell, setSelectCell] = useState({});
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [prevCell, setPrevCell] = useState("");
    const [currentCell, setCurrentCell] = useState("");
    const [nextCell, setNesXtCell] = useState("");

    const [selectStack, setSelectStack] = useState([]);

    useEffect(() => {
        document.addEventListener("mouseup", mouseUp);
        return () => {
            document.removeEventListener("mouseup", mouseUp);
        };
    }, []);

    const handleCurrentCell = (row, col) => {
        setSelectCell({ [row + col]: true });
    };

    const mouseDown = (row, col) => {
        setSelectCell({ [row + col]: true });
        console.log(" mouse down ", row, col);
        setIsMouseDown(true);

        const slt = [...selectStack];

        slt.push(row + col);
        setSelectStack(slt);
    };

    const mouseOver = (row, col) => {
        if (isMouseDown) {
            console.log(" mouse over ", row, col);
            let select = { ...selectCell };

            const slt = [...selectStack];

            if (slt[slt.length - 2] == row + col) {
                delete select[slt[slt.length - 1]];
                slt.pop();
                setSelectStack(slt);
            } else {
                select = { ...selectCell, [row + col]: true };
                slt.push(row + col);
                setSelectStack(slt);
            }
            setSelectCell(select);
        }
    };

    const mouseOut = (row, col) => {
        console.log(" mouse out ", row, col);
    };
    const mouseUp = () => {
        console.log(" mouse up ");
        setIsMouseDown(false);
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
                    {selectCell[row + col] && <div className='td_corner'></div>}
                </td>
            </React.Fragment>
        );
    };
    //console.log(isMouseDown);
    //console.log(selectStack);
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
