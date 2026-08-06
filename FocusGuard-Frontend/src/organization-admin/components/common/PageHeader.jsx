function PageHeader({
    title,
    subtitle,
    action,
}) {

    return (

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

                <h1 className="text-3xl font-extrabold text-slate-900">

                    {title}

                </h1>

                {

                    subtitle && (

                        <p className="mt-2 text-sm font-medium text-slate-500">

                            {subtitle}

                        </p>

                    )

                }

            </div>

            {

                action && (

                    <div>

                        {action}

                    </div>

                )

            }

        </div>

    );

}

export default PageHeader;
