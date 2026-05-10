import Link from "next/link"
import Image from "next/image"

interface Props {
  imgUrl:string,
  alt:string,
  value:string|number,
  isAuthor?:boolean,
  textStyles?:string,
  imgStyle?:string,
  title:string,
  href?:string,
  titleStyles?:string
}

const Metric = ({imgUrl,alt,value,title,href,isAuthor,textStyles,imgStyle,titleStyles}:Props) => {
  // know it is like of not
  const metricContent=(
    <>
      <Image src={imgUrl} alt={alt} width={16} height={16} className={`rounded-full object-contain ${imgStyle}`}/>
      <p className={`${textStyles} flex items-center gap-1`}>{value}
      {title.length>0 && (<span className={`small-regular ${titleStyles} line-clamp-1 ${isAuthor?"max-sm:hidden":""}`}>{title}</span>)}
      </p>
    </>
  )
  return href?(
    <Link href={href} className="flex-center gap-1">{metricContent}</Link>
  ):(
    <div className="flex-center gap-1">{metricContent}</div>
  )
}

export default Metric
