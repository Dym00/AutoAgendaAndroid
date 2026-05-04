import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      <span className={styles.initiativeTag}>A INICIATIVA</span>
      <h2 className={styles.title} aria-level="2">Sobre o Projeto</h2>
      
      <p className={styles.description}>
        O AutoAgenda nasceu para redefinir a gestão automotiva no país. Combinamos tecnologia de ponta para oferecer uma plataforma robusta de agendamentos, estoque de peças e histórico veicular. Nosso foco é transformar dados técnicos em decisões inteligentes para mecânicos e proprietários.
      </p>

      <div className={styles.grid} role="list" aria-label="Informações sobre a equipe e projeto">
        <div className={styles.card} role="listitem">
          <h3 className={styles.cardTitle}>DEVs</h3>
          <div className={styles.cardContent}>
            CAMILLA DE SOUZA<br/>
            HECTOR SEMENSSATO<br/>
            DIMITRI BONIFACIO
          </div>
        </div>

        <div className={styles.card} role="listitem">
          <h3 className={styles.cardTitle}>Universidade</h3>
          <div className={styles.cardContent}>
            CENTRO UNIVERSITÁRIO<br/>
            SENAC SANTO AMARO
          </div>
        </div>

        <div className={styles.card} role="listitem">
          <h3 className={styles.cardTitle}>Mentor</h3>
          <div className={styles.cardContent}>
            ODAIR GONCALVES
          </div>
        </div>

        <div className={styles.card} role="listitem">
          <h3 className={styles.cardTitle}>Disciplina</h3>
          <div className={styles.cardContent}>
            PROJETO INTEGRADOR:<br/>
            PROGRAMAÇÃO PARA DISPOSITIVOS MÓVEIS
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
