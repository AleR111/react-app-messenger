import {
  LinearProgress,
  Button,
  Container,
  Paper,
  InputBase,
  IconButton,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { Search } from "@material-ui/icons"
import { Pagination } from "@material-ui/lab"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getPublicGists,
  searchPublicGistsByLogin,
} from "../../store/publicGists/thunks"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  rootInput: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  error: {
    color: "red",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}))

export const PublicGistsApi = () => {
  const classes = useStyles()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, isPending, error } = useSelector(
    (store) => store.publicGistsStore,
  )
  const dispatch = useDispatch()

  const newPage = (page) => {
    setPage(page)
    dispatch(getPublicGists(page))
  }

  useEffect(() => {
    if (data.length) return
    dispatch(getPublicGists())
  }, [dispatch])

  useEffect(() => {
    if (!search) return
    dispatch(searchPublicGistsByLogin(search))
  }, [dispatch, search])

  const changeHandler = (event) => {
    setSearch(event.target.value)
  }

  const debouncedChangeHandler = useCallback(debounce(changeHandler, 1500), [])

  if (isPending) {
    return (
      <div className={classes.root}>
        <LinearProgress />
      </div>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <h1 className={classes.error}>{error}</h1>
        <div className={classes.root}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch(getPublicGists())}
          >
            Reload
          </Button>
        </div>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl">
      <Paper component="form" className={classes.rootInput}>
        <InputBase
          className={classes.input}
          placeholder="Search"
          inputProps={{ "aria-label": "search google maps" }}
          onChange={debouncedChangeHandler}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
        >
          <Search />
        </IconButton>
      </Paper>
      <div>
        {data.length ? (
          data.map((elem, index) => {
            return (
              <div key={index}>
                {elem.owner.login}:
                <a href={elem.owner.url} rel="noreferrer" target="_blank">
                  {elem.owner.url}
                </a>
              </div>
            )
          })
        ) : (
          <div>
            {data.login}:{" "}
            <a href={data.url} rel="noreferrer" target="_blank">
              {data.url}
            </a>
          </div>
        )}
      </div>
      {data.length && (
        <div className={classes.root}>
          <Pagination
            count={data.length}
            page={page}
            shape="rounded"
            onChange={(e, page) => newPage(page)}
          />
        </div>
      )}
    </Container>
  )
}
