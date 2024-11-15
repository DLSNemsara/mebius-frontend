function Button(props){
    const handleClick = (e) => {
        console.log(e);
        console.log("Button clicked");
    };

    return (
        
    <button 
    type="button"
    onClick={handleClick}
    className="block p-2 px-4 py-2 font-medium text-white bg-black rounded-md w-fit">
        {props.children}
        </button>
);  
}

export default Button;