import { Enterprise } from "@/interfaces/Enterprise";

const CraneItem = ({crane}: {crane:Enterprise}) => {
    return ( <div>
        <h3>{crane.name}</h3>
        <img src={crane.logoImgUrl} alt="" />
    </div> );
}
 
export default CraneItem;