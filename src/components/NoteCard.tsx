import { useState } from "react";

export interface Note {
    id: number,
    text: string;
    done: boolean;
}

interface Props extends Note {
    edit: (id: number, text: string, done: boolean) => void,
    delete: (id: number) => void,
}

export const NoteCard: React.FC<Props> = (props: Props) => {
    const [newText, setNewText] = useState<string>(props.text);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    let cardClasses: string = "card col s12 m6 l4 hoverable ";

    if (isEditing) cardClasses += "blue-grey lighten-5";
    else if (props.done) cardClasses += "green accent-2";
    else cardClasses += "amber accent-2";

    return (
        <div className={cardClasses} key={props.id} style={{transition: "600ms"}}>
            <div className="card-content">
                {
                    isEditing ?
                    (
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                props.edit(props.id, newText, props.done);
                                setIsEditing(!isEditing);
                            }}
                        >
                            <input
                                type="text"
                                value={newText}
                                onChange={(event) => setNewText(event.target.value)}
                            />
                        </form>
                    )
                    :
                    (
                        <p className="card-title">{props.text}</p>
                    )
                }
            </div>
            <div className="card-action row">
                <div className="col left-align">
                    <a className={
                        `btn-floating waves-effect waves-white ${
                            props.done ? "teal accent-4" : "amber accent-3"}`
                    }>
                        <i
                            className="small material-icons"
                            onClick={() => {
                                props.edit(props.id, props.text, !props.done);
                            }}
                        >
                            {props.done ? "check_box" : "check_box_outline_blank"}
                        </i>
                    </a>
                </div>
                <div className="col right">
                    <a className="btn-floating waves-effect waves-white red darken-3">
                        <i
                            className="small material-icons"
                            onClick={() => props.delete(props.id)}
                        >
                            delete
                        </i>
                    </a>
                </div>
                <div className="col right">
                    <a className="btn-floating waves-effect waves-white blue-grey">
                        <i
                            className="small material-icons"
                            onClick={() => {
                                if (isEditing) props.edit(props.id, newText, props.done);
                                setIsEditing(!isEditing);
                            }}
                        >
                            edit
                        </i>
                    </a>
                </div>
            </div>
        </div>
    )
}