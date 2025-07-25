import "../styles/SkeletonLoader.scss";

const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-header" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-box" />
      <div className="skeleton-header" />
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
      <div className="skeleton-line" />
      <div className="skeleton-box" />
    </div>
  );
};

export default SkeletonLoader;
