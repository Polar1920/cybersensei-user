import React from 'react'; 
import '../styles/Home.css'
import { Button } from 'antd';

function Home() {
 return (
    <>
    <div className="home">
      <h3>Bienvenido, ¿Es tu primera vez aquí?</h3>
      <div className="end">
        <Button type="favorite" href="/select-edad">
          SI
        </Button>
        <Button type="second" href="/sign">
          NO
        </Button>
      </div>
    </div>
  </>
 );
}
export default Home;