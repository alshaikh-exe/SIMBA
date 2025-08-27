// src/components/Footer/Footer.jsx
import React from "react";
import styles from "./Footer.module.scss";
import logo from "../../assets/cccccccc.png";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Left: dedicated logo slot */}
        <div className={styles.logoSlot}>
         <img src={logo} alt="SIMBA" /> 
        </div>

        {/* Brand / tagline */}
        <div className={styles.logoCol}>
          <div className={styles.logo}>SIMBA</div>
          <p className={styles.tagline}>
            Smart Inventory Management & Booking Application
          </p>
        </div>

        {/* Contributors */}
        <div className={styles.col}>
          <h2 className={styles.heading}>Contributors</h2>
          <ul className={styles.list}>
            <li><a className={styles.link} href="https://www.linkedin.com/in/abdullaalshaikh/" target="_blank" rel="noreferrer"><strong className={styles.role}>PM</strong> Abdulla Alshaikh</a></li>
            <li><a className={styles.link} href="https://www.linkedin.com/in/fatema-alzaki/" target="_blank" rel="noreferrer"><strong className={styles.role}>FE</strong> Fatema Alzaki</a></li>
            <li><a className={styles.link} href="https://www.linkedin.com/in/hamza-mohammad-iqbal/" target="_blank" rel="noreferrer"><strong className={styles.role}>FE/BE</strong> Hamza Iqbal</a></li>
            <li><a className={styles.link} href="https://www.linkedin.com/in/mohammed-ali-ahmed-278546228/" target="_blank" rel="noreferrer"><strong className={styles.role}>BE</strong> Mohammed Ahmed Din</a></li>
            <li><a className={styles.link} href="https://www.linkedin.com/in/sakeena-kadhem-sayed-abdulla/" target="_blank" rel="noreferrer"><strong className={styles.role}>BE</strong> Sakeena Sayed Kadhem</a></li>
            <li><a className={styles.link} href="https://www.linkedin.com/in/zahraa-busuhail/" target="_blank" rel="noreferrer"><strong className={styles.role}>FE</strong> Zahraa Busuhail</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className={styles.col}>
          <h2 className={styles.heading}>Contact</h2>
          <ul className={styles.list}>
            <li><a className={styles.link} href="mailto:alshaikhabdulla6@gmail.com">alshaikhabdulla6@gmail.com</a></li>
            <li><a className={styles.link} href="mailto:fatimaalzaki242@gmail.com">fatimaalzaki242@gmail.com</a></li>
            <li><a className={styles.link} href="mailto:hamzaiqbal146@gmail.com">hamzaiqbal146@gmail.com</a></li>
            <li><a className={styles.link} href="mailto:mohd73480@gmail.com">mohd73480@gmail.com</a></li>
            <li><a className={styles.link} href="mailto:sakeenas.kadhem@gmail.com">sakeenas.kadhem@gmail.com</a></li>
            <li><a className={styles.link} href="mailto:zahraasuhail2006@gmail.com">zahraasuhail2006@gmail.com</a></li>
          </ul>
        </div>

        {/* About */}
        <div className={styles.aboutCol}>
          <h2 className={styles.heading}>About</h2>
          <p className={styles.copy}>
            This platform was designed to take the hassle out of equipment and engineering management, giving Polytechnic students and admin a smarter, smoother way to get things done.
          </p>
          <p className={styles.copyDim}>© 2025 SIMBA. All Rights Reserved.</p>
        </div>
      </div>

      <div className={styles.credits}>
        <span>Built with ♥ for students & labs</span>
      </div>
    </footer>
  );
};

export default Footer;
