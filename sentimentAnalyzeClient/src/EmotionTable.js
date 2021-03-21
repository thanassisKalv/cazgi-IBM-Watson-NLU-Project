import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    state = { emotionList:[] }
    componentDidMount() {
        console.log(this.props.emotions);
        let listOfEmotions = Object.entries(this.props.emotions);
         let emotionTable = listOfEmotions.map((emotion)=>{
             //console.log(emotion);
             return <tr><td style={{color: "black",border: "1px solid black"}}>{emotion[0]} </td>
          <td style={{color: "black",border: "1px solid black"}}> {emotion[1]} </td></tr>
         });

         this.setState({emotionList:<table style={{border: "1px solid black", "margin-left": "auto", "margin-right": "auto"}}><tbody>{emotionTable}</tbody></table>})
    }

    
  render() {
    const colorStyle = { color:"black",fontSize:"20px"}
    let li_ctr = 0;
    return (
      <div style={colorStyle}>
        Emotions Table
        <br/>
            {
            this.state.emotionList
            }
        </div>
    );
  }
    
}
export default EmotionTable;
