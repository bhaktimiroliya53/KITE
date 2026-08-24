import { useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import "./EmojiGifPicker.css";


function EmojiGifPicker({ onEmoji, onGif }) {

    const [tab, setTab] = useState("emoji");


    const gifs = [
    "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif",
    "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif",
    "https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"
];


    return (

        <div className="picker-box">


            <div className="picker-tabs">

                <button
                    className={tab === "emoji" ? "active" : ""}
                    onClick={() => setTab("emoji")}
                >
                    😊 Emoji
                </button>


                <button
                    className={tab === "gif" ? "active" : ""}
                    onClick={() => setTab("gif")}
                >
                    GIF
                </button>


            </div>



            {
                tab === "emoji" &&

                <Picker
                    data={data}
                    onEmojiSelect={(emoji) => {
                        onEmoji(emoji.native)
                    }}
                />

            }




            {
                tab === "gif" &&

                <div className="gif-area">


                    <div className="gif-search">

                        <input
                            type="text"
                            placeholder="Search GIF..."
                        />

                    </div>



                    <div className="gif-grid">


                        {
                            gifs.map((url,index)=>(

                                <div
                                    className="gif-card"
                                    key={index}
                                   onClick={() => {
    console.log("GIF CLICKED =>", url);
    onGif(url);
}}
                                >

                                    <img
                                        src={url}
                                        alt="gif"
                                    />

                                </div>

                            ))
                        }


                    </div>


                </div>

            }



        </div>


    )

}


export default EmojiGifPicker;