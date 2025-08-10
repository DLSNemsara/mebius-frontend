function Tab(props) {
  const handleClick = (e) => {
    props.onTabClick(props._id);
  };

  if (props._id === props.selectedCategoryId) {
    return (
      <button className="px-4 py-2 font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-md transition-all duration-300 transform hover:shadow-lg hover:scale-105">
        {props.name}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 font-medium text-gray-700 bg-white rounded-full border border-gray-200 shadow-sm transition-all duration-300 transform hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 hover:scale-105 hover:shadow-md"
    >
      {props.name}
    </button>
  );
}

export default Tab;
