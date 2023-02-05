import React from "react";

interface Props {
    currentValue: string;
    setCurrentValue: React.Dispatch<React.SetStateAction<string>>;
    add: (text: string) => void;
}

const InputField: React.FC<Props> = (props: Props) => {
    return (
        <form
            className="container row"
            onSubmit={(event) => {
                event.preventDefault();
                props.add(props.currentValue);
                props.setCurrentValue("");
            }}>
                <input
                    className="col s10"
                    type="text"
                    id="new-text"
                    placeholder="Nova nota"
                    value={props.currentValue}
                    onChange={(event) => props.setCurrentValue(event.target.value)} />
                <button
                    className="col offset-s1 btn-floating btn-large waves-effect waves-light blue-grey"
                    type="submit">
                        <i className="material-icons">add</i>
                </button>
        </form>
    )
}

export default InputField;