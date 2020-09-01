import React, {Component} from "react";
import axios from "axios";
import Titre from "../../component/Titre/TitreH1";
import Personnage from "../../containers/ListePersonnage/Personnage/Personnage";

class ListePersonnage extends Component{
    state={
        personnages:null,
        loading:false,
    }
    loaData=()=>{
        this.setState({loading:true});
        axios.get("https://jcdprojet2.firebaseio.com/persos.json")
            .then(reponse=>{
                console.log(reponse.data);
                const personnages=Object.values(reponse.data);
                this.setState({
                    personnages,
                    loading:false
                })
            })
            .catch(error=>{
                console.log(error);
                this.setState({loading:false});
            })
    }
    componentDidMount=()=> {
    this.loaData();
    }
    componentDidUpdate=(oldProps,oldState)=> {
        if (oldProps.refresh!==this.props.refresh){
            this.loaData();
        }

    }

    render() {
        return(
            <>
                {this.state.loading && <div>Chargement...</div>}
                {!this.state.loading && this.state.personnages &&
                <div className={"row no-gutters"}>
                    {this.state.personnages.map((perso,indice) => {
                        return (
                            <div className={"col-6"} key={indice}>
                               <Titre> {perso.nom}</Titre>
                                <Personnage {...perso.perso}/>
                            </div>
                        );
                    })}
                </div>}

              </>
        );
    }
}

export default ListePersonnage;