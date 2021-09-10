import "./App.css";
import React, { useEffect, useState } from "react";

const data = {
    2019: {
        "01": 0.0002,
        "02": 0.0004,
        "03": 0.0004,
        "04": 0.0004,
        "05": 0.0004,
        "06": 0.0004,
    },
    2020: {
        "01": 0.0009,
        "02": 0.2154,
        "03": 0.0004,
        "04": 0.0004,
        "05": 0.0004,
        "06": 0.0004,
    },
    2021: {
        "01": 0.0002,
        "02": 0.0004,
        "03": 0.0004,
        "04": 0.0004,
        "05": 0.0004,
        "06": 0.0004,
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

    const handleCurrentCell = (pcc, month) => {
        setSelectCell({ [pcc + month]: true });
    };

    const mouseDown = (pcc, month) => {
        setSelectCell({ [pcc + month]: true });
        console.log(" mouse down ", pcc, month);
        setIsMouseDown(true);

        const slt = [...selectStack];

        slt.push(pcc + month);
        setSelectStack(slt);
    };

    const mouseOver = (pcc, month) => {
        if (isMouseDown) {
            console.log(" mouse over ", pcc, month);
            let select = { ...selectCell };

            const slt = [...selectStack];

            if (slt[slt.length - 2] == pcc + month) {
                delete select[slt[slt.length - 1]];
                slt.pop();
                setSelectStack(slt);
            } else {
                select = { ...selectCell, [pcc + month]: true };
                slt.push(pcc + month);
                setSelectStack(slt);
            }
            setSelectCell(select);
        }
    };

    const mouseOut = (pcc, month) => {
        console.log(" mouse out ", pcc, month);
    };
    const mouseUp = () => {
        console.log(" mouse up ");
        setIsMouseDown(false);
    };
    const CustomCell = ({ pcc, month }) => {
        return (
            <React.Fragment>
                <td
                    className={
                        selectCell[pcc + month] ? "td_selected" : undefined
                    }
                    //onClick={() => handleCurrentCell(pcc, month)}
                    onMouseDown={() => mouseDown(pcc, month)}
                    onMouseEnter={() => mouseOver(pcc, month)}
                    //onMouseOut={() => mouseOut(pcc, month)}
                    //onMouseUp={() => mouseUp(pcc, month)}
                >
                    {data[pcc][month]}
                    {selectCell[pcc + month] && (
                        <div className='td_corner'></div>
                    )}
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
                        <th> Year</th>
                        <th>Jan</th>
                        <th>Feb</th>
                        <th>Mar</th>
                        <th>Arp</th>
                        <th>May</th>
                        <th>Jun</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(data).map((pcc, index) => (
                        <tr key={index}>
                            <td>{pcc}</td>
                            <CustomCell pcc={pcc} month='01' />
                            <CustomCell pcc={pcc} month='02' />
                            <CustomCell pcc={pcc} month='03' />
                            <CustomCell pcc={pcc} month='04' />
                            <CustomCell pcc={pcc} month='05' />
                            <CustomCell pcc={pcc} month='06' />
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
