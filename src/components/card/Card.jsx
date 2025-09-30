import Card from 'components/card'
import { useNavigate } from 'react-router-dom'
// import ApiCaller from 'common/services/apiServices';

/**
 * A function that handles a click event for a new web service.
 *
 * @return {Promise<void>} Navigates to the specified route path.
 */
const GetStarted = ({
  title,
  author,
  extra,
  page,
  image,
  isComing,
  routePath,
  buttonText,
}) => {
  let navigate = useNavigate()
  /**
   * A description of the entire function.
   *
   * @return {Promise<void>} Navigates to the specified route path.
   */
  const handleNewWebServiceClick = async () => {
    navigate(routePath)
  }
  return (
    <Card
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <>
        <div className="h-full w-full ">
          {isComing && (
            <>
              <div className="absolute left-0 top-0 h-full w-full bg-white opacity-0 "></div>
              <div className="text-dark absolute left-0 top-0 flex h-full w-full items-center  justify-center bg-black bg-cardBlur text-[28px] font-bold text-white">
                {' '}
                Coming Soon
              </div>
            </>
          )}
          <div className="mb-3 flex items-center justify-between px-1 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
            <div className="mb-2 p-1">
              <div className="flex pb-5">
                <div className="rounded-lg bg-lightPrimary p-1 dark:bg-navy-700">
                  <img src={image} className="rounded-full pt-1" alt="img" />
                </div>
                <div className="p-1.5">
                  <span className="mt-1 pl-1 text-lg font-bold text-navy-700 dark:text-white ">
                    {title}
                  </span>
                </div>
              </div>
              <div className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
                <span className="font-bold text-navy-500">{page}</span>{' '}
                <span
                  className={`font-bold text-navy-700 ${
                    isComing ? 'dark:text-gray-100' : 'dark:text-white'
                  } `}
                >
                  {author}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row-reverse md:mb-2 md:mt-2 lg:mt-0  ">
          <button
            className="rounded-[20px] bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90"
            onClick={handleNewWebServiceClick}
          >
            {buttonText}
          </button>
        </div>
      </>
    </Card>
  )
}

export default GetStarted
