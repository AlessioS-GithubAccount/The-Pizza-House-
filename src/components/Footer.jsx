import styles from '../styles/Footer.module.css';

export default function Footer() {
  return (
    <footer
      className={`container-fluid position-relative text-white ${styles.footerRoot}`}
      style={{ overflow: 'hidden' }}
    >
   
      <div className={`${styles.buttonbarSocial} ${styles.therealfooter} mt-4`}>
        <ul className={styles.socialIcons}>
          <li><a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><i className={`fab fa-facebook ${styles.icon}`}></i></a></li>
          <li><a href="mailto:thepizzahouse@gmail.com"><i className={`fa fa-envelope ${styles.icon}`}></i></a></li>
          <li><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><i className={`fab fa-instagram ${styles.icon}`}></i></a></li>
          <li><a href="https://wa.me/1234567890" target="_blank" rel="noreferrer"><i className={`fab fa-whatsapp ${styles.icon}`}></i></a></li>
        </ul>
      </div>
    </footer>
  );
}
