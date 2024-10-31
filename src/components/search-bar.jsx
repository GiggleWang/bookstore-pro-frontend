import '../css/search-bar.css'

export default function SearchBar(props) {
  return (
    <div className='SearchBar'>
      <input
        className='SearchBar-input'
        type="text"
        value={props.keyword}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
      <button className='SearchBar-submit' />
    </div>
  )
}