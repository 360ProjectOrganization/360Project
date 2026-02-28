export default function ChooseFigure({text, img, func}){
    return(
        <figure>
            <figcaption>{text}</figcaption>
            <img src={img} alt="" onClick={func}/>                          
        </figure>
    )
}