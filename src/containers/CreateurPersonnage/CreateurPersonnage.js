import React,{Component} from "react";
import TitreH1 from "../../component/Titre/TitreH1";
import Bouton from "../../component/Bouton/Button";
import Personnage from "./Personnage/Personnage";
import Armes from './Armes/Armes';
import axios from "axios";

class CreateurPersonnage extends Component{
    state={
        personnage :{
            image:1,
            force:0,
            agilite:0,
            intelligence:0,
            arme:null
        },
        nbPointsDisponibles :7,
        armes:null,
        loading:false,
        nom:"",
    }
    componentDidMount=()=> {
        this.setState({loading:true});
        axios.get("https://jcdprojet2.firebaseio.com/armes.json")
            .then(reponse=>{
                const armesArray=Object.values(reponse.data);
              this.setState({
                  armes:armesArray,
                  loading:false,
              });
            })
            .catch(error=>{
                this.setState({
                    loading:false,
                });
            })
    }

    handleImagePrecedente=()=>{
this.setState((oldState=>{
    const newPersonnage={...oldState.personnage};
    if(oldState.personnage.image<=1) newPersonnage.image=3;
    else newPersonnage.image--;
    return {personnage : newPersonnage}
}))
    }
    handleImageSuivante=()=>{
        this.setState((oldState=>{
            const newPersonnage={...oldState.personnage};
            if(oldState.personnage.image>=3) newPersonnage.image=1;
            else newPersonnage.image++;
            return {personnage : newPersonnage}
        }))
    }
    handleEnleverPoint=(carac)=>{
        this.setState((oldState,props)=>{
            if (oldState.personnage[carac]<=0 || oldState.nbPointsDisponibles>=7)return null;
            const newPointCarac =oldState.personnage[carac]-1
            const  newPerso={...oldState.personnage};
            const newNbPointDisponible= oldState.nbPointsDisponibles+1;
            newPerso[carac]=newPointCarac;
            return {
                personnage: newPerso,
                nbPointsDisponibles: newNbPointDisponible
            }
        })
    }
    handleAjouterPoint=(carac)=>{
       this.setState((oldState,props)=>{
           if (oldState.personnage[carac]>=5 || oldState.nbPointsDisponibles<=0)return null;
           const newPointCarac =oldState.personnage[carac]+1
           const  newPerso={...oldState.personnage};
           const newNbPointDisponible= oldState.nbPointsDisponibles-1;
           newPerso[carac]=newPointCarac;
           return {
               personnage: newPerso,
               nbPointsDisponibles: newNbPointDisponible
           }
       })
    }
    handleChangeArmePersonnage=(arme)=>{
        const newPerso={...this.state.personnage};
        newPerso.arme=arme;
        this.setState({personnage:newPerso});
    }
    handleReinitialisation=()=>{
this.setState({
    personnage :{
        image:1,
        force:0,
        agilite:0,
        intelligence:0,
        arme:null
    },
    nbPointsDisponibles :7,
    armes:["epee","fleau","arc","hache"]
})
    }
    handleValidation=()=>{
        this.setState({loading:true});
       const player={
           perso:{...this.state.personnage},
           nom:this.state.nom
       }
       axios.post("https://jcdprojet2.firebaseio.com/persos.json",player)
           .then(reponse=>{
               console.log(reponse)
               this.setState({loading:false});
               this.handleReinitialisation();
               this.props.refresh();
           })
           .catch(error=>{
               console.log(error)
               this.setState({loading:false});
               this.handleReinitialisation();
           })
    }
    render() {
        return(
            <div className="container">
                <TitreH1>Créateur de personnage</TitreH1>
                {
                    this.state.loading && <div>Chargement...</div>
                }
                <div className="form-group">
                    <label htmlFor="inputName">Nom :</label>
                    <input type="text" className="form-control" id="inputName" value={this.state.nom}
                           onChange={event => this.setState({nom:event.target.value})}/>
                </div>
                <Personnage
                    {...this.state.personnage}
                precedente={this.handleImagePrecedente}
                suivante={this.handleImageSuivante}
                nbPointsDisponibles={this.state.nbPointsDisponibles}
                ajouterPoint={this.handleAjouterPoint}
                enleverPoint={ this.handleEnleverPoint}/>

                {
                    this.state.armes &&
                    <Armes
                        listeArmes={this.state.armes}
                        changeArme={this.handleChangeArmePersonnage}
                        currentArme={this.state.personnage.arme}
                    />
                }

                <div className="row no-gutters">
                    <Bouton typeBtn="btn-danger" css="col-6" clic={this.handleReinitialisation}>Réinitialiser</Bouton>
                    <Bouton typeBtn="btn-success" css="col-6" clic={this.handleValidation}>Créer</Bouton>
                </div>
            </div>
        )
    }
}

export default CreateurPersonnage;