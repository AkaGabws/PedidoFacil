import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddOrder = () => {
    const [client, setClient] = useState('');
    const [quantized, setQuantized] = useState(0);
    const [prazo, setPrazo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post('http://localhost:3001/orders', {client, quantized, prazo});
            console.log(response.data);
        } catch (error) {
            console.error(error.message);
        }
};

}; return ( <form onSubmit={handleSubmit}>
 <input type="text" placeholder="Client" value={client} onChange={(e) => setClient(e.target.value)} required />
 <input type="number" placeholder="Quantized" value={quantized} onChange={(e) => setQuantized(e.target.value)} required />
 <input type="date" value={prazo} onChange={(e) => setPrazo(e.target.value)} required />
 <button type="submit">Adicionar Pedido</button>
</form> );

export default AddOrder;