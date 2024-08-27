import Breadcrumb from "../../../components/UI/General/Breadcrumb.tsx";
import CardFilter from "../../../components/UI/General/CardFilter/CardFilter.tsx";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// Контент
import GeneralInformation from "./DisclosureContent/GeneralInformation.tsx";
import Checkup from "./DisclosureContent/Checkup.tsx";
import Documents from "./DisclosureContent/Documents.tsx";
import Resolution from "./DisclosureContent/Resolution.tsx";
import Operations from "./DisclosureContent/Operations.tsx";
import Statuses from "./DisclosureContent/Statuses.tsx";
import InteragencyRequests from "./DisclosureContent/InteragencyRequests.tsx";
import Notes from "./DisclosureContent/Notes.tsx";

const Details = () => {
  return (
    <>
      <Breadcrumb pageName="Заявки" />
      <div className="grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12">
          <CardFilter name="Заявки">
            <div className="w-full divide-y divide-stroke rounded-xl bg-white/5">
              <Disclosure as="div" defaultOpen={true}>
                <DisclosureButton className="group flex w-full items-center justify-between py-3">
                  <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    Общие сведения
                  </span>
                  <ChevronDownIcon className="w-5 h-5 bg-primary/10 rounded-sm fill-primary group-data-[hover]:fill-primary group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="text-sm/5 text-black/50">
                  <GeneralInformation />
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div">
                <DisclosureButton className="group flex w-full items-center justify-between py-3">
                  <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    Обследования
                  </span>
                  <ChevronDownIcon className="w-5 h-5 bg-primary/10 rounded-sm fill-primary group-data-[hover]:fill-primary group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
                  <Checkup />
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div">
                <DisclosureButton className="group flex w-full items-center justify-between py-3">
                  <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    Документы
                  </span>
                  <ChevronDownIcon className="w-5 h-5 bg-primary/10 rounded-sm fill-primary group-data-[hover]:fill-primary group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
                  <Documents />
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div">
                <DisclosureButton className="group flex w-full items-center justify-between py-3">
                  <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    Решения
                  </span>
                  <ChevronDownIcon className="w-5 h-5 bg-primary/10 rounded-sm fill-primary group-data-[hover]:fill-primary group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
                  <Resolution />
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div">
                <DisclosureButton className="group flex w-full items-center justify-between py-3">
                  <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    Операции
                  </span>
                  <ChevronDownIcon className="w-5 h-5 bg-primary/10 rounded-sm fill-primary group-data-[hover]:fill-primary group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
                  <Operations />
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div">
                <DisclosureButton className="group flex w-full items-center justify-between py-3">
                  <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    Статусы
                  </span>
                  <ChevronDownIcon className="w-5 h-5 bg-primary/10 rounded-sm fill-primary group-data-[hover]:fill-primary group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
                  <Statuses />
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div">
                <DisclosureButton className="group flex w-full items-center justify-between py-3">
                  <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    Межведомственные запросы
                  </span>
                  <ChevronDownIcon className="w-5 h-5 bg-primary/10 rounded-sm fill-primary group-data-[hover]:fill-primary group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
                  <InteragencyRequests />
                </DisclosurePanel>
              </Disclosure>
              <Disclosure as="div">
                <DisclosureButton className="group flex w-full items-center justify-between py-3">
                  <span className="text-sm/6 font-medium  group-data-[hover]:text-black/80">
                    Замечания
                  </span>
                  <ChevronDownIcon className="w-5 h-5 bg-primary/10 rounded-sm fill-primary group-data-[hover]:fill-primary group-data-[open]:rotate-180" />
                </DisclosureButton>
                <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
                  <Notes />
                </DisclosurePanel>
              </Disclosure>
            </div>
          </CardFilter>
        </div>
      </div>
    </>
  );
};

export default Details;
