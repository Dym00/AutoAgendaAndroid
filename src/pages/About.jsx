import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './About.module.css';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <span className={styles.initiativeTag}>A INICIATIVA</span>
      <h2 className={styles.title} aria-level="2">Sobre o Projeto</h2>
      
      <p className={styles.description}>
        {t('about.description')}
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
