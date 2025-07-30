import "../styles/MyStyles.scss";

const Welcome = () => {
  return (
    <>
      <h2>Welcome!</h2>
      <p>
        Here is a basic React application to display data from my
        Spring Boot API. <br />
        No UI library has been used in this React app. I built each component
        myself but had some css styles generated as a starting place.
        <br />
        Use the navigation bar to go to the Asset Management page.
      </p>
    </>
  );
};

export default Welcome;
