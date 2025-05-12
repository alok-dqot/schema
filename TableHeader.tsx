import { TextField, Autocomplete, Checkbox } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const TableHeader = () => {

  return (
    <>

      <div className="table-header">
        <div className="left-btn-box">


          {/* <CustomComp
              icon={<BorderAllIcon className='bi-table' />}
              name={"Table"}
              onClick={() => { console.log('working') }}
            />
   
            <CustomComp
              icon={<DehazeIcon className='bi-table' />}
              name={"Board"}
              onClick={() => { console.log('working') }}
            />
   
   
            <CustomComp
              icon={< FormatListBulletedIcon className='bi-table' />}
              name={"List"}
              onClick={() => { console.log('working') }}
            /> */}



          <div className="custom-search">
            <Search icon={<SearchIcon className="bi-table" />} />
          </div>



        </div>


        <div className="right-btn-box">



          {/* <CustomComp
              icon={<TuneRoundedIcon className='bi-table' />}
              name={"Hide"}
              onClick={() => { console.log('working') }}
            />
   
           
            <CustomComp
              icon={<AutoAwesomeIcon className='bi-table' />}
              name={"Customize"}
              onClick={() => { console.log('working') }}
            /> */}


          <button className="btn">
            <AddIcon className='bi-table' />
          </button>

          <div className="multibox">
            <MutliSelect />
          </div>

        </div>
      </div>




    </>
  )

}

export default TableHeader


const Search = ({ icon }: any) => {
  return (
    <div className="img-table">
      <TextField
        className="search-input"
        id="outlined-basic"
        label="Search"
        variant="outlined"
        size="small"
      />
      <div className="icon">
        {icon}
      </div>
    </div>
  );
};




const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MutliSelect = ({ list, value, onChange, label }: any) => {
  return (
    <>
      <Autocomplete
        multiple
        id="checkboxes-tags-demo"
        options={list}
        disableCloseOnSelect
        value={value}
        getOptionLabel={(option: any) => option.title}
        onChange={(_e: any, value: any) => {
          onChange(value);
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.title}
            </li>
          );
        }}
        style={{ width: 150 }}
        renderInput={(params) => (
          <TextField {...params} label={label} size="small" />
        )}
      />
    </>
  );
};
